import React from 'react';

export default function JourneyTab({ currentStep }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🌟 내 여정</h2>
        <p className="text-gray-600">
          당신의 학습 진행 과정을 기록합니다. (v0.2에서 출시)
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 text-center">
        <p className="text-lg text-gray-700 mb-4">
          📔 학습 여정 타임라인
        </p>
        <p className="text-gray-600 mb-6">
          v0.2에서는 다음 기능을 추가할 예정입니다:
        </p>
        <ul className="text-sm text-gray-700 space-y-2 text-left bg-white rounded p-4">
          <li>✅ 각 단계별 학습 기록</li>
          <li>✅ 미션 완료 시간 자동 기록</li>
          <li>✅ 학생 입력 텍스트 저장</li>
          <li>✅ 캡처 이미지 업로드 및 보관</li>
          <li>✅ PDF 보고서 생성</li>
        </ul>
      </div>

      <div className="bg-gray-100 rounded-lg p-6 border border-gray-300">
        <h3 className="font-bold text-gray-800 mb-4">📌 현재 진행 상황</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-white p-3 rounded">
            <span className="text-2xl">📚</span>
            <div>
              <p className="font-semibold text-gray-800">3단계: 데이터 전처리</p>
              <p className="text-sm text-gray-600">현재 진행 중...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
