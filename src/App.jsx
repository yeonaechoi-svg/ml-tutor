import React, { useState, useEffect, useRef } from 'react';
import StartScreen from './components/StartScreen';
import MainLayout from './components/MainLayout';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import { stepsIndex } from './data/steps_index';
import { isFirebaseEnabled, auth, googleProvider } from './firebase';
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
  const [user, setUser] = useState(null);
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState(3);
  const [currentTab, setCurrentTab] = useState('learn');
  const [currentMission, setCurrentMission] = useState(1);
  const [chatHistory, setChatHistory] = useState([]);
  const [journeyEntries, setJourneyEntries] = useState([]);
  const [authLoading, setAuthLoading] = useState(isFirebaseEnabled);
  const [dataLoaded, setDataLoaded] = useState(!isFirebaseEnabled);

  const uidRef = useRef(null);

  // Firebase 인증 상태 감지 및 데이터 복원
  useEffect(() => {
    if (!isFirebaseEnabled) return;

    let signInWithPopup, signOut, onAuthStateChanged;
    Promise.all([
      import('firebase/auth').then((m) => {
        signInWithPopup = m.signInWithPopup;
        signOut = m.signOut;
        onAuthStateChanged = m.onAuthStateChanged;
      }),
    ]).then(() => {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        uidRef.current = fbUser?.uid || null;

        if (fbUser) {
          try {
            const data = await loadUserData(fbUser.uid);
            if (data?.name) {
              setUser({ name: data.name, studentId: data.studentId, isTeacher: false });
              if (data.steps) setSteps(data.steps);
              if (data.currentStep) setCurrentStep(data.currentStep);
              if (data.currentTab) setCurrentTab(data.currentTab);
              if (data.currentMission) setCurrentMission(data.currentMission);
              if (data.chatHistory) setChatHistory(data.chatHistory);
            }
            const entries = await loadJourneyEntries(fbUser.uid);
            setJourneyEntries(entries);
          } catch (e) {
            console.error('데이터 로드 실패:', e);
          }
        }

        setDataLoaded(true);
        setAuthLoading(false);
      });
      return () => unsubscribe();
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 진행 상황 자동 저장 (Firebase 연동 시)
  useEffect(() => {
    if (!isFirebaseEnabled || !dataLoaded || !uidRef.current || !user?.name) return;
    saveUserData(uidRef.current, {
      steps,
      currentStep,
      currentTab,
      currentMission,
    }).catch(console.error);
  }, [steps, currentStep, currentTab, currentMission, dataLoaded, user]);

  const handleGoogleLogin = async (name, studentId) => {
    if (!isFirebaseEnabled) {
      setUser({ name, studentId, isTeacher: false });
      return;
    }
    const { signInWithPopup: popup } = await import('firebase/auth');
    const result = await popup(auth, googleProvider);
    const fbUser = result.user;
    uidRef.current = fbUser.uid;

    const existing = await loadUserData(fbUser.uid);
    const profile = existing?.name
      ? { name: existing.name, studentId: existing.studentId }
      : {
          name: name || fbUser.displayName || '학생',
          studentId: studentId || '',
        };

    await saveUserData(fbUser.uid, { ...profile, email: fbUser.email });
    setUser({ ...profile, isTeacher: false });

    if (existing?.steps) setSteps(existing.steps);
    if (existing?.currentStep) setCurrentStep(existing.currentStep);
    if (existing?.currentMission) setCurrentMission(existing.currentMission);

    const entries = await loadJourneyEntries(fbUser.uid);
    setJourneyEntries(entries);
    setDataLoaded(true);
  };

  const handleStartStudent = (name, studentId) => {
    setUser({ name, studentId, isTeacher: false });
  };

  const handleStartTeacher = () => {
    setUser({ isTeacher: true });
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
        imageUrls: journeyEntry.imageUrls || [],
      };

      if (isFirebaseEnabled && uidRef.current) {
        try {
          await saveJourneyEntry(uidRef.current, entry);
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
      if (isFirebaseEnabled && uidRef.current) {
        saveUserData(uidRef.current, { chatHistory: next }).catch(console.error);
      }
      return next;
    });
  };

  const handleLogout = async () => {
    if (isFirebaseEnabled && uidRef.current) {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    }
    uidRef.current = null;
    setUser(null);
    setSteps(initialSteps());
    setCurrentStep(3);
    setCurrentTab('learn');
    setCurrentMission(1);
    setChatHistory([]);
    setJourneyEntries([]);
    setDataLoaded(!isFirebaseEnabled);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🤖</div>
          <p className="text-gray-600 text-lg">ML 튜터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <StartScreen
        onStartStudent={handleStartStudent}
        onStartTeacher={handleStartTeacher}
        onGoogleLogin={handleGoogleLogin}
        isFirebaseEnabled={isFirebaseEnabled}
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
      uid={uidRef.current}
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
