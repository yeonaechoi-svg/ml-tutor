import React from 'react';
import { step3Content } from '../../data/step3_content';

export default function LearnTab({ currentStep }) {
  // Get content for the current step
  const getContent = (stepId) => {
    if (stepId === 3) {
      return step3Content;
    }
    return null;
  };

  const content = getContent(currentStep);

  if (!content) {
    return <div className="text-center text-gray-500">콘텐츠를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📚 학습</h2>
        <p className="text-gray-600">{content.stepName}에 대해 배워봅시다.</p>
      </div>

      <div className="space-y-4">
        {content.learn.map((concept) => (
          <div
            key={concept.id}
            className="bg-white border border-gray-300 rounded-lg p-5 hover:shadow-md transition"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">📖</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">
                  {concept.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {concept.description}
                </p>
              </div>
            </div>

            <div className="mt-4 bg-gray-800 text-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
              {concept.code.split('\n').map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 text-sm text-blue-800">
        💡 <strong>학습 팁:</strong> 위의 개념들을 잘 이해한 후 퀴즈에 도전해보세요!
      </div>
    </div>
  );
}
