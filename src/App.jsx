import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import MainLayout from './components/MainLayout';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import { stepsIndex } from './data/steps_index';
import { isFirebaseEnabled } from './firebase';
import {
  loadUserData,
  saveUserData,
  saveJourneyEntry,
  loadJourneyEntries,
} from './utils/firestoreUtils';

const initialSteps = () =>
  stepsIndex.map((step) => ({
    ...step,
    unlocked: step.id <= 3,
    quizPassed: false,
    missions: step.id === 3 ? Array(5).fill(false) : [],
  }));

function App() {
  const [user, setUser] = useState(null);       // { name, studentId, classCode, isTeacher }
  const [userKey, setUserKey] = useState(null); // Firestore 문서 ID: classCode_studentId
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState(3);
  const [currentTab, setCurrentTab] = useState('learn');
  const [currentMission, setCurrentMission] = useState(1);
  const [chatHistory, setChatHistory] = useState([]);
  const [journeyEntries, setJourneyEntries] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // 진행 상황 자동 저장
  useEffect(() => {
    if (!isFirebaseEnabled || !userKey || !dataLoaded) return;
    saveUserData(userKey, {
      steps,
      currentStep,
      currentTab,
      currentMission,
    }).catch(console.error);
  }, [steps, currentStep, currentTab, currentMission, userKey, dataLoaded]);

  const handleStartStudent = async (name, studentId, classCode) => {
    const key = `${classCode}_${studentId}`;

    if (isFirebaseEnabled) {
      try {
        const existing = await loadUserData(key);
        if (existing?.name) {
          // 재접속: 저장된 진행 상황 복원
          setUser({ name: existing.name, studentId, classCode, isTeacher: false });
          if (existing.steps) setSteps(existing.steps);
          if (existing.currentStep) setCurrentStep(existing.currentStep);
          if (existing.currentTab) setCurrentTab(existing.currentTab);
          if (existing.currentMission) setCurrentMission(existing.currentMission);
          if (existing.chatHistory) setChatHistory(existing.chatHistory);
        } else {
          // 첫 접속: 프로필 저장
          setUser({ name, studentId, classCode, isTeacher: false });
          await saveUserData(key, { name, studentId, classCode });
        }
        const entries = await loadJourneyEntries(key);
        setJourneyEntries(entries);
      } catch (e) {
        console.error('데이터 로드 실패:', e);
        setUser({ name, studentId, classCode, isTeacher: false });
      }
    } else {
      setUser({ name, studentId, classCode, isTeacher: false });
    }

    setUserKey(key);
    setDataLoaded(true);
  };

  const handleStartTeacher = () => {
    setUser({ isTeacher: true });
    setDataLoaded(true);
  };

  const handleQuizPass = () => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === currentStep ? { ...step, quizPassed: true } : step
      )
    );
    setCurrentTab('mission');
  };

  const handleMissionComplete = async (missionId, journeyEntry) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id !== currentStep) return step;
        const newMissions = [...step.missions];
        newMissions[missionId - 1] = true;
        return { ...step, missions: newMissions };
      })
    );
    if (missionId < 5) setCurrentMission(missionId + 1);

    if (journeyEntry) {
      const entry = {
        stepId: currentStep,
        missionId,
        missionTitle: journeyEntry.missionTitle,
        completedAt: new Date().toISOString(),
        note: journeyEntry.note || '',
        codeResult: journeyEntry.codeResult || null,
      };

      if (isFirebaseEnabled && userKey) {
        try {
          await saveJourneyEntry(userKey, entry);
        } catch (e) {
          console.error('여정 저장 실패:', e);
        }
      }

      setJourneyEntries((prev) => [
        ...prev.filter(
          (e) => !(e.stepId === currentStep && e.missionId === missionId)
        ),
        entry,
      ]);
    }
  };

  const handleAddChat = (role, message) => {
    setChatHistory((prev) => {
      const next = [...prev, { role, message }];
      if (isFirebaseEnabled && userKey) {
        saveUserData(userKey, { chatHistory: next }).catch(console.error);
      }
      return next;
    });
  };

  const handleLogout = () => {
    setUser(null);
    setUserKey(null);
    setSteps(initialSteps());
    setCurrentStep(3);
    setCurrentTab('learn');
    setCurrentMission(1);
    setChatHistory([]);
    setJourneyEntries([]);
    setDataLoaded(false);
  };

  if (!user) {
    return (
      <StartScreen
        onStartStudent={handleStartStudent}
        onStartTeacher={handleStartTeacher}
      />
    );
  }

  if (user.isTeacher) {
    return <TeacherDashboard onLogout={handleLogout} />;
  }

  return (
    <MainLayout
      user={user}
      steps={steps}
      currentStep={currentStep}
      currentTab={currentTab}
      currentMission={currentMission}
      chatHistory={chatHistory}
      journeyEntries={journeyEntries}
      uid={userKey}
      onTabChange={setCurrentTab}
      onStepChange={setCurrentStep}
      onQuizPass={handleQuizPass}
      onMissionComplete={handleMissionComplete}
      onAddChat={handleAddChat}
      onLogout={handleLogout}
    />
  );
}

export default App;
