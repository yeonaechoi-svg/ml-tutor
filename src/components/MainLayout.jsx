import React from 'react';
import ProgressPanel from './ProgressPanel';
import GuidePanel from './GuidePanel';
import TutorChat from './TutorChat';

export default function MainLayout({
  user,
  steps,
  currentStep,
  currentTab,
  currentMission,
  chatHistory,
  journeyEntries,
  uid,
  onTabChange,
  onStepChange,
  onQuizPass,
  onMissionComplete,
  onAddChat,
  onLogout,
}) {
  const currentStepData = steps.find((s) => s.id === currentStep);
  const isQuizPassed = currentStepData?.quizPassed;

  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* 좌측 진행 패널 (200px) */}
      <div className="w-48 border-r border-gray-300 bg-white overflow-y-auto">
        <ProgressPanel
          steps={steps}
          currentStep={currentStep}
          onStepChange={onStepChange}
        />
      </div>

      {/* 중앙 가이드 패널 (flex-grow) */}
      <div className="flex-grow border-r border-gray-300 bg-white overflow-y-auto">
        <GuidePanel
          user={user}
          steps={steps}
          currentStep={currentStep}
          currentTab={currentTab}
          currentMission={currentMission}
          isQuizPassed={isQuizPassed}
          journeyEntries={journeyEntries}
          uid={uid}
          onTabChange={onTabChange}
          onQuizPass={onQuizPass}
          onMissionComplete={onMissionComplete}
        />
      </div>

      {/* 우측 AI 튜터 패널 (320px) */}
      <div className="w-80 border-l border-gray-300 bg-gray-50 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <TutorChat
            currentStep={currentStep}
            currentTab={currentTab}
            currentMission={currentMission}
            chatHistory={chatHistory}
            onAddChat={onAddChat}
          />
        </div>
        <div className="p-4 border-t border-gray-300 bg-white">
          <button
            onClick={onLogout}
            className="w-full px-3 py-2 bg-red-500 text-white text-sm font-bold rounded hover:bg-red-600 transition"
          >
            로그아웃
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            👤 {user.name} ({user.studentId})
          </p>
        </div>
      </div>
    </div>
  );
}
