import React, { useState } from 'react';

export default function MissionCompleteModal({
  missionTitle,
  codeResult,
  onSave,
  onSkip,
}) {
  const [note, setNote] = useState('');

  return (
    <div className="flex items-center justify-center min-h-full py-8 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎯</div>
          <h3 className="text-2xl font-bold text-gray-800">미션 완료!</h3>
          <p className="text-sm text-blue-600 font-medium mt-1">{missionTitle}</p>
        </div>

        {/* 코드 실행 결과 미리보기 */}
        {codeResult && (
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              💾 저장될 코드 결과
            </p>
            <div className="rounded-lg overflow-hidden border border-gray-700 text-xs font-mono">
              {/* 코드 */}
              <div className="bg-[#1e1e2e] text-[#cdd6f4] px-4 py-3 max-h-32 overflow-y-auto whitespace-pre">
                {codeResult.code}
              </div>
              {/* 출력 */}
              <div
                className="px-4 py-2 max-h-24 overflow-y-auto whitespace-pre"
                style={{
                  backgroundColor: '#0d1117',
                  color: codeResult.error ? '#ff6b6b' : '#39d353',
                }}
              >
                {codeResult.error || codeResult.output || '(출력 없음)'}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              코드와 실행 결과가 여정 기록에 자동 저장됩니다.
            </p>
          </div>
        )}

        {!codeResult && (
          <div className="mb-5 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
            ⚠️ 코드를 실행한 후 완료하면 결과가 함께 저장됩니다.
          </div>
        )}

        {/* 텍스트 기록 */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ✏️ 오늘 배운 점을 기록해보세요{' '}
            <span className="text-gray-400 font-normal">(선택)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="예: 결측치 23개를 dropna()로 처리했다. isnull().sum()으로 먼저 확인하는 방법을 배웠다."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition text-sm"
          >
            건너뛰기
          </button>
          <button
            onClick={() => onSave({ note })}
            className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm"
          >
            저장하기 ✅
          </button>
        </div>
      </div>
    </div>
  );
}
