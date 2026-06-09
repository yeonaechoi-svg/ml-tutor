import React, { useState, useRef, useEffect } from 'react';
import { callClaudeAPI } from '../utils/claudeApi';
import { step3Content } from '../data/step3_content';

export default function TutorChat({
  currentStep,
  currentTab,
  currentMission,
  chatHistory,
  onAddChat,
}) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  // 탭/미션 변경 시 추천 질문 닫기
  useEffect(() => {
    setShowQuestions(false);
  }, [currentTab, currentMission]);

  const getStepInfo = (stepId) => {
    if (stepId === 3) return { name: step3Content.stepName, content: step3Content };
    return { name: '알 수 없음', content: null };
  };

  const stepInfo = getStepInfo(currentStep);

  const getSuggestedQuestions = () => {
    const sq = stepInfo.content?.suggestedQuestions;
    if (!sq) return [];
    if (currentTab === 'learn') return sq.learn || [];
    if (currentTab === 'quiz') return sq.quiz || [];
    if (currentTab === 'mission') return sq.missions?.[currentMission] || [];
    return [];
  };

  const suggestedQuestions = getSuggestedQuestions();

  const getContextLabel = () => {
    if (currentTab === 'learn') return `📚 ${currentStep}단계 학습`;
    if (currentTab === 'quiz') return `❓ ${currentStep}단계 퀴즈`;
    if (currentTab === 'mission') return `💻 미션 ${currentMission}`;
    return `🌟 내 여정`;
  };

  const sendMessage = async (message) => {
    if (!message.trim() || isLoading) return;
    setError(null);
    setShowQuestions(false);
    onAddChat('user', message);
    setIsLoading(true);

    try {
      const missionName = currentTab === 'mission'
        ? stepInfo.content?.missions?.find((m) => m.id === currentMission)?.title
        : null;

      const response = await callClaudeAPI(
        message, currentStep, stepInfo.name, currentTab,
        currentTab === 'mission' ? currentMission : null, missionName
      );
      onAddChat('assistant', response);
    } catch (err) {
      setError(err.message || '오류가 발생했습니다.');
      onAddChat('assistant', `오류: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full p-3">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-800">🤖 AI 튜터</h3>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
          {getContextLabel()}
        </span>
      </div>

      {/* 대화창 — 대화 내역만 표시 */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {chatHistory.length === 0 && (
          <div className="text-sm text-gray-400 text-center py-8">
            <p>안녕하세요! 🙋</p>
            <p className="mt-1">아래 <strong>추천 질문</strong> 버튼을 누르거나</p>
            <p>직접 질문을 입력해보세요.</p>
          </div>
        )}
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm rounded-bl-none">
              생각 중... ⏳
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {error && (
        <div className="mb-2 p-2 bg-red-100 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      {/* 추천 질문 팝업 (위로 펼쳐짐) */}
      {showQuestions && suggestedQuestions.length > 0 && (
        <div className="mb-2 bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1.5">
          <p className="text-xs font-bold text-blue-700 mb-2">
            📋 질문을 선택하세요
          </p>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              className="w-full text-left px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs text-gray-700 hover:bg-blue-100 hover:border-blue-400 transition disabled:opacity-50 flex items-start gap-2"
            >
              <span className="font-bold text-blue-500 shrink-0">{idx + 1}.</span>
              <span>{q}</span>
            </button>
          ))}
        </div>
      )}

      {/* 입력 영역 */}
      <div className="space-y-2">
        {/* 추천 질문 버튼 */}
        {suggestedQuestions.length > 0 && (
          <button
            onClick={() => setShowQuestions(!showQuestions)}
            className={`w-full py-1.5 text-xs font-semibold rounded-lg border transition ${
              showQuestions
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
            }`}
          >
            {showQuestions ? '📋 추천 질문 닫기 ▼' : '📋 추천 질문 보기 ▲'}
          </button>
        )}

        {/* 직접 입력 폼 */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="직접 질문 입력..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-3 py-2 bg-blue-500 text-white text-sm font-bold rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
}
