import React, { useState } from 'react';
import { stepsIndex } from '../../data/steps_index';

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
    d.getDate()
  ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`;
}

function handlePrint(user, journeyEntries, steps) {
  const completedStepIds = [
    ...new Set(journeyEntries.map((e) => e.stepId)),
  ].sort((a, b) => a - b);

  const content = completedStepIds
    .map((stepId) => {
      const stepInfo = stepsIndex.find((s) => s.id === stepId);
      const stepEntries = journeyEntries.filter((e) => e.stepId === stepId);
      const stepState = steps.find((s) => s.id === stepId);

      const entriesHtml = stepEntries
        .map(
          (e) => `
          <div class="entry">
            <p class="mission-title">미션 ${e.missionId}: ${e.missionTitle}</p>
            <p class="time">완료: ${formatDate(e.completedAt)}</p>
            ${e.note ? `<p class="note">📝 ${e.note}</p>` : ''}
            ${
              e.codeResult
                ? `<div class="code-block">
                    <p class="code-label">📋 코드</p>
                    <pre class="code">${e.codeResult.code}</pre>
                    <p class="code-label">▶ 실행 결과</p>
                    <pre class="output ${e.codeResult.error ? 'error' : ''}">${
                    e.codeResult.error || e.codeResult.output || '(출력 없음)'
                  }</pre>
                   </div>`
                : ''
            }
          </div>
        `
        )
        .join('');

      return `
        <div class="step-block">
          <h2>${stepId}단계: ${stepInfo?.name || ''}</h2>
          ${stepState?.quizPassed ? '<p class="quiz-badge">✅ 퀴즈 통과</p>' : ''}
          ${entriesHtml || '<p class="empty">기록 없음</p>'}
        </div>
      `;
    })
    .join('');

  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="utf-8" />
      <title>ML 여정 보고서 - ${user?.name || '학생'}</title>
      <style>
        body { font-family: 'Malgun Gothic', sans-serif; padding: 30px; max-width: 820px; margin: 0 auto; color: #1f2937; }
        h1 { font-size: 22px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
        .step-block { margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 18px; }
        h2 { font-size: 16px; color: #1d4ed8; margin: 0 0 10px; }
        .quiz-badge { font-size: 12px; color: #059669; margin-bottom: 10px; }
        .entry { border-left: 3px solid #3b82f6; padding-left: 12px; margin: 10px 0; }
        .mission-title { font-weight: bold; font-size: 13px; margin: 0 0 3px; }
        .time { font-size: 11px; color: #6b7280; margin: 0 0 5px; }
        .note { font-size: 12px; background: #fef3c7; padding: 6px 10px; border-radius: 4px; margin: 5px 0; }
        .code-block { margin-top: 8px; }
        .code-label { font-size: 11px; font-weight: bold; color: #4b5563; margin: 4px 0 2px; }
        pre.code { background: #1e1e2e; color: #cdd6f4; padding: 8px; border-radius: 4px; font-size: 11px; overflow-x: auto; margin: 0 0 4px; white-space: pre-wrap; }
        pre.output { background: #0d1117; color: #39d353; padding: 8px; border-radius: 4px; font-size: 11px; overflow-x: auto; margin: 0; white-space: pre-wrap; }
        pre.output.error { color: #ff6b6b; }
        .empty { color: #9ca3af; font-size: 12px; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <h1>📔 ML 여정 보고서 — ${user?.name || '학생'} (${user?.studentId || ''})</h1>
      ${content || '<p>아직 기록된 여정이 없습니다.</p>'}
      <br/>
      <button onclick="window.print()" style="padding:10px 24px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;">
        🖨️ 인쇄 / PDF 저장
      </button>
    </body>
    </html>
  `);
  win.document.close();
}

export default function JourneyTab({ user, steps, journeyEntries = [] }) {
  const [expandedCode, setExpandedCode] = useState(null); // missionId or null

  const completedStepIds = [
    ...new Set(journeyEntries.map((e) => e.stepId)),
  ].sort((a, b) => a - b);

  if (journeyEntries.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🌟 내 여정</h2>
          <p className="text-gray-600">미션을 완료하면 여정 기록이 쌓입니다.</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">📔</div>
          <p className="text-lg text-gray-700 font-medium mb-2">아직 기록이 없어요</p>
          <p className="text-sm text-gray-500">
            미션을 완료하면 코드·실행 결과·배운 점이 타임라인으로 기록됩니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🌟 내 여정</h2>
          <p className="text-sm text-gray-500 mt-1">
            {user?.name} · 총 {journeyEntries.length}개 미션 완료
          </p>
        </div>
        <button
          onClick={() => handlePrint(user, journeyEntries, steps)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition"
        >
          📄 PDF 출력
        </button>
      </div>

      {/* 단계별 타임라인 */}
      {completedStepIds.map((stepId) => {
        const stepInfo = stepsIndex.find((s) => s.id === stepId);
        const stepState = steps?.find((s) => s.id === stepId);
        const stepEntries = journeyEntries
          .filter((e) => e.stepId === stepId)
          .sort((a, b) => a.missionId - b.missionId);

        return (
          <div
            key={stepId}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
          >
            {/* 단계 헤더 */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 flex items-center justify-between">
              <span className="text-white font-bold text-base">
                📌 {stepId}단계: {stepInfo?.name}
              </span>
              {stepState?.quizPassed && (
                <span className="text-xs bg-white text-blue-600 font-bold px-2 py-1 rounded-full">
                  ✅ 퀴즈 통과
                </span>
              )}
            </div>

            <div className="p-4 space-y-4">
              {stepEntries.map((entry) => {
                const isExpanded = expandedCode === `${stepId}_${entry.missionId}`;
                return (
                  <div
                    key={entry.missionId}
                    className="border-l-4 border-blue-400 pl-4 py-1"
                  >
                    {/* 미션 제목 + 완료 시간 */}
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-gray-800 text-sm">
                        ✅ 미션 {entry.missionId}: {entry.missionTitle}
                      </p>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(entry.completedAt)}
                      </span>
                    </div>

                    {/* 학생 기록 */}
                    {entry.note && (
                      <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                        <p className="text-xs text-yellow-700 font-semibold mb-0.5">
                          ✏️ 내 기록
                        </p>
                        <p className="text-sm text-gray-700">{entry.note}</p>
                      </div>
                    )}

                    {/* 코드 결과 */}
                    {entry.codeResult && (
                      <div className="mt-2">
                        <button
                          onClick={() =>
                            setExpandedCode(isExpanded ? null : `${stepId}_${entry.missionId}`)
                          }
                          className="text-xs text-blue-600 font-semibold hover:underline"
                        >
                          {isExpanded ? '▲ 코드 접기' : '▼ 코드 결과 보기'}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 rounded-lg overflow-hidden border border-gray-700 text-xs font-mono">
                            <div className="bg-[#1e1e2e] text-[#cdd6f4] px-4 py-3 max-h-40 overflow-y-auto whitespace-pre">
                              {entry.codeResult.code}
                            </div>
                            <div
                              className="px-4 py-2 max-h-32 overflow-y-auto whitespace-pre"
                              style={{
                                backgroundColor: '#0d1117',
                                color: entry.codeResult.error ? '#ff6b6b' : '#39d353',
                              }}
                            >
                              {entry.codeResult.error ||
                                entry.codeResult.output ||
                                '(출력 없음)'}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
