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
              e.imageUrls?.length > 0
                ? `<div class="images">${e.imageUrls
                    .map((url) => `<img src="${url}" alt="캡처" />`)
                    .join('')}</div>`
                : ''
            }
          </div>
        `
        )
        .join('');

      const quizStatus = stepState?.quizPassed ? '✅ 퀴즈 통과' : '';

      return `
        <div class="step-block">
          <h2>${stepId}단계: ${stepInfo?.name || ''}</h2>
          ${quizStatus ? `<p class="quiz-badge">${quizStatus}</p>` : ''}
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
        body { font-family: 'Malgun Gothic', sans-serif; padding: 30px; max-width: 800px; margin: 0 auto; color: #1f2937; }
        h1 { font-size: 24px; border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 24px; }
        .step-block { margin-bottom: 32px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
        h2 { font-size: 18px; color: #1d4ed8; margin: 0 0 12px; }
        .quiz-badge { font-size: 13px; color: #059669; margin-bottom: 12px; }
        .entry { border-left: 3px solid #3b82f6; padding-left: 12px; margin: 12px 0; }
        .mission-title { font-weight: bold; font-size: 14px; margin: 0 0 4px; }
        .time { font-size: 12px; color: #6b7280; margin: 0 0 6px; }
        .note { font-size: 13px; background: #fef3c7; padding: 8px; border-radius: 4px; margin: 6px 0; }
        .images { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        img { max-width: 180px; max-height: 180px; object-fit: cover; border-radius: 4px; border: 1px solid #e5e7eb; }
        .empty { color: #9ca3af; font-size: 13px; }
        @media print { body { padding: 15px; } button { display: none; } }
      </style>
    </head>
    <body>
      <h1>📔 ML 여정 보고서 — ${user?.name || '학생'} (${user?.studentId || ''})</h1>
      ${content || '<p>아직 기록된 여정이 없습니다.</p>'}
      <br/><button onclick="window.print()" style="padding:10px 24px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;">🖨️ 인쇄 / PDF 저장</button>
    </body>
    </html>
  `);
  win.document.close();
}

export default function JourneyTab({ user, steps, journeyEntries = [] }) {
  const [expandedImages, setExpandedImages] = useState(null);

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
            미션을 완료하고 배운 점을 기록하면 여기에 타임라인이 만들어집니다.
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
              <div>
                <span className="text-white font-bold text-base">
                  📌 {stepId}단계: {stepInfo?.name}
                </span>
              </div>
              {stepState?.quizPassed && (
                <span className="text-xs bg-white text-blue-600 font-bold px-2 py-1 rounded-full">
                  ✅ 퀴즈 통과
                </span>
              )}
            </div>

            <div className="p-4 space-y-4">
              {stepEntries.map((entry) => (
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

                  {/* 이미지 썸네일 */}
                  {entry.imageUrls?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 font-semibold mb-1">
                        🖼️ 캡처 이미지 ({entry.imageUrls.length}장)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {entry.imageUrls.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`캡처 ${i + 1}`}
                            onClick={() =>
                              setExpandedImages({ urls: entry.imageUrls, index: i })
                            }
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* 이미지 확대 뷰어 */}
      {expandedImages && (
        <div
          className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 cursor-pointer"
          onClick={() => setExpandedImages(null)}
        >
          <div className="text-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={expandedImages.urls[expandedImages.index]}
              alt="확대"
              className="max-w-full max-h-96 rounded-lg shadow-2xl"
            />
            <div className="flex items-center justify-center gap-4 mt-3">
              {expandedImages.urls.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setExpandedImages((prev) => ({
                        ...prev,
                        index:
                          (prev.index - 1 + prev.urls.length) % prev.urls.length,
                      }))
                    }
                    className="px-3 py-1 bg-white text-gray-800 rounded font-bold text-sm"
                  >
                    ◀ 이전
                  </button>
                  <span className="text-white text-sm">
                    {expandedImages.index + 1} / {expandedImages.urls.length}
                  </span>
                  <button
                    onClick={() =>
                      setExpandedImages((prev) => ({
                        ...prev,
                        index: (prev.index + 1) % prev.urls.length,
                      }))
                    }
                    className="px-3 py-1 bg-white text-gray-800 rounded font-bold text-sm"
                  >
                    다음 ▶
                  </button>
                </>
              )}
              <button
                onClick={() => setExpandedImages(null)}
                className="px-3 py-1 bg-red-500 text-white rounded font-bold text-sm"
              >
                ✕ 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
