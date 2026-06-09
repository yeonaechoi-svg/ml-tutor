import React from 'react';
import LearnTab from './tabs/LearnTab';
import QuizTab from './tabs/QuizTab';
import MissionTab from './tabs/MissionTab';
import JourneyTab from './tabs/JourneyTab';

export default function GuidePanel({
  currentStep,
  currentTab,
  currentMission,
  isQuizPassed,
  onTabChange,
  onQuizPass,
  onMissionComplete,
}) {
  const tabs = [
    { id: 'learn', label: '📚 학습', disabled: false },
    { id: 'quiz', label: '❓ 퀴즈', disabled: false },
    { id: 'mission', label: '💻 실습', disabled: !isQuizPassed },
    { id: 'journey', label: '🌟 내 여정', disabled: false },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-300 bg-white sticky top-0 z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={`flex-1 px-4 py-3 font-semibold text-sm border-b-2 transition ${
              currentTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600'
            } ${
              tab.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentTab === 'learn' && (
          <LearnTab currentStep={currentStep} />
        )}
        {currentTab === 'quiz' && (
          <QuizTab currentStep={currentStep} onPass={onQuizPass} />
        )}
        {currentTab === 'mission' && (
          <MissionTab
            currentStep={currentStep}
            currentMission={currentMission}
            onMissionComplete={onMissionComplete}
          />
        )}
        {currentTab === 'journey' && (
          <JourneyTab currentStep={currentStep} />
        )}
      </div>
    </div>
  );
}
