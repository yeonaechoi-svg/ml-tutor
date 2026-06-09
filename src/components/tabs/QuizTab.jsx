import React, { useState } from 'react';
import { step3Content } from '../../data/step3_content';

export default function QuizTab({ currentStep, onPass }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

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

  const handleSelectAnswer = (questionId, optionIdx) => {
    if (!submitted) {
      setAnswers({ ...answers, [questionId]: optionIdx });
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    content.quiz.forEach((q) => {
      if (answers[q.id] === q.answer) {
        correct++;
      }
    });
    setCorrectCount(correct);
    setSubmitted(true);

    if (correct === content.quiz.length) {
      setTimeout(() => onPass(), 1500);
    }
  };

  const isAllAnswered = content.quiz.every((q) => answers[q.id] !== undefined);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">❓ 퀴즈</h2>
        <p className="text-gray-600">
          학습 내용을 이해했는지 확인해봅시다. (3문제)
        </p>
      </div>

      <div className="space-y-4">
        {content.quiz.map((question) => (
          <div
            key={question.id}
            className="bg-white border border-gray-300 rounded-lg p-5"
          >
            <h3 className="font-bold text-gray-800 mb-3">
              Q{question.id}. {question.question}
            </h3>

            <div className="space-y-2">
              {question.options.map((option, optionIdx) => (
                <label
                  key={optionIdx}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                    submitted
                      ? optionIdx === question.answer
                        ? 'bg-green-100 border-green-500'
                        : answers[question.id] === optionIdx
                        ? 'bg-red-100 border-red-500'
                        : 'border-gray-300'
                      : answers[question.id] === optionIdx
                      ? 'bg-blue-100 border-blue-500'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={optionIdx}
                    checked={answers[question.id] === optionIdx}
                    onChange={() => handleSelectAnswer(question.id, optionIdx)}
                    disabled={submitted}
                    className="w-4 h-4"
                  />
                  <span
                    className={
                      submitted
                        ? optionIdx === question.answer
                          ? 'text-green-700 font-semibold'
                          : answers[question.id] === optionIdx
                          ? 'text-red-700'
                          : ''
                        : ''
                    }
                  >
                    {option}
                  </span>
                  {submitted && optionIdx === question.answer && (
                    <span className="ml-auto">✅</span>
                  )}
                  {submitted &&
                    answers[question.id] === optionIdx &&
                    optionIdx !== question.answer && (
                    <span className="ml-auto">❌</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {submitted ? (
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-5">
          <div className="text-center mb-4">
            <p className="text-2xl font-bold text-blue-700">
              {correctCount === content.quiz.length ? '🎉 완벽해요!' : '😊 다시 시도해보세요'}
            </p>
            <p className="text-lg text-gray-700">
              {correctCount} / {content.quiz.length} 문제 정답
            </p>
          </div>
          {correctCount === content.quiz.length && (
            <div className="text-center">
              <p className="text-green-700 font-semibold mb-3">
                ✅ 퀴즈를 통과했습니다!
              </p>
              <p className="text-sm text-gray-600">
                이제 실습 탭에서 미션을 수행할 수 있습니다.
              </p>
            </div>
          )}
          {correctCount < content.quiz.length && (
            <button
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
              className="w-full mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
            >
              다시 풀기
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!isAllAnswered}
          className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          답안 제출하기
        </button>
      )}
    </div>
  );
}
