import React from 'react';

export default function ProgressPanel({ steps, currentStep, onStepChange }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-6">📋 수업 진행</h2>
      <div className="space-y-2">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => step.unlocked && onStepChange(step.id)}
            disabled={!step.unlocked}
            className={`w-full p-3 rounded-lg text-left text-sm font-semibold transition ${
              step.unlocked
                ? currentStep === step.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                : 'bg-gray-50 text-gray-500 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {step.unlocked
                  ? step.quizPassed
                    ? '✅'
                    : '🔵'
                  : '🔒'}
              </span>
              <div className="flex-1">
                <p className="text-xs opacity-75">{step.id}단계</p>
                <p className="truncate">{step.name}</p>
              </div>
            </div>
            {step.unlocked && step.missions && step.missions.length > 0 && (
              <p className="text-xs mt-1 ml-6 opacity-75">
                미션: {step.missions.filter((m) => m).length}/{step.missions.length}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
