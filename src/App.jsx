import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import MainLayout from './components/MainLayout';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import { stepsIndex } from './data/steps_index';

function App() {
  const [user, setUser] = useState(null);
  const [steps, setSteps] = useState(
    stepsIndex.map((step) => ({
      ...step,
      unlocked: step.id <= 3, // MVP: 3단계까지만 해제
      quizPassed: false,
      missions: step.id === 3 ? Array(5).fill(false) : [],
    }))
  );
  const [currentStep, setCurrentStep] = useState(3);
  const [currentTab, setCurrentTab] = useState('learn');
  const [currentMission, setCurrentMission] = useState(1);
  const [chatHistory, setChatHistory] = useState([]);

  const handleStartStudent = (name, studentId) => {
    setUser({ name, studentId, isTeacher: false });
    // 현재 단계를 3단계로 설정하고 이미 퀴즈가 통과되지 않은 상태
    setCurrentStep(3);
    setCurrentTab('learn');
    setCurrentMission(1);
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

  const handleMissionComplete = (missionId) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === currentStep) {
          const newMissions = [...step.missions];
          newMissions[missionId - 1] = true;
          return { ...step, missions: newMissions };
        }
        return step;
      })
    );
    // 다음 미션 활성화
    if (missionId < 5) {
      setCurrentMission(missionId + 1);
    }
  };

  const handleAddChat = (role, message) => {
    setChatHistory((prev) => [...prev, { role, message }]);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentStep(3);
    setCurrentTab('learn');
    setCurrentMission(1);
    setChatHistory([]);
  };

  // 시작 화면
  if (!user) {
    return (
      <StartScreen
        onStartStudent={handleStartStudent}
        onStartTeacher={handleStartTeacher}
      />
    );
  }

  // 교사 대시보드
  if (user.isTeacher) {
    return <TeacherDashboard onLogout={handleLogout} />;
  }

  // 학생 메인 레이아웃
  return (
    <MainLayout
      user={user}
      steps={steps}
      currentStep={currentStep}
      currentTab={currentTab}
      currentMission={currentMission}
      chatHistory={chatHistory}
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
