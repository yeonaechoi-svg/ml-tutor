import React, { useState } from 'react';
import { step3Content } from '../../data/step3_content';
import CodeRunner from '../CodeRunner';
import MissionCompleteModal from '../MissionCompleteModal';

export default function MissionTab({
  currentStep,
  currentMission,
  uid,
  onMissionComplete,
}) {
  const [selectedMission, setSelectedMission] = useState(currentMission);
  const [completedMissions, setCompletedMissions] = useState({});
  const [pendingMission, setPendingMission] = useState(null);
  const [codeResults, setCodeResults] = useState({}); // {missionId: {code, output, error}}

  const getContent = (stepId) => {
    if (stepId === 3) return step3Content;
    return null;
  };

  const content = getContent(currentStep);
  if (!content)
    return (
      <div className="text-center text-gray-500">콘텐츠를 불러올 수 없습니다.</div>
    );

  const activeMission = content.missions.find((m) => m.id === selectedMission);

  const handleCodeResult = (missionId, result) => {
    setCodeResults((prev) => ({ ...prev, [missionId]: result }));
  };

  const handleClickComplete = (missionId) => {
    setPendingMission(missionId);
  };

  const handleModalSave = ({ note }) => {
    const mission = content.missions.find((m) => m.id === pendingMission);
    setCompletedMissions((prev) => ({ ...prev, [pendingMission]: true }));
    onMissionComplete(pendingMission, {
      missionTitle: mission?.title || '',
      note,
      codeResult: codeResults[pendingMission] || null,
    });
    if (pendingMission < content.missions.length) {
      setSelectedMission(pendingMission + 1);
    }
    setPendingMission(null);
  };

  const handleModalSkip = () => {
    const mission = content.missions.find((m) => m.id === pendingMission);
    setCompletedMissions((prev) => ({ ...prev, [pendingMission]: true }));
    onMissionComplete(pendingMission, {
      missionTitle: mission?.title || '',
      note: '',
      codeResult: codeResults[pendingMission] || null,
    });
    if (pendingMission < content.missions.length) {
      setSelectedMission(pendingMission + 1);
    }
    setPendingMission(null);
  };

  // 미션 완료 모달 표시
  if (pendingMission !== null) {
    const mission = content.missions.find((m) => m.id === pendingMission);
    return (
      <MissionCompleteModal
        missionTitle={mission?.title || ''}
        codeResult={codeResults[pendingMission] || null}
        onSave={handleModalSave}
        onSkip={handleModalSkip}
      />
    );
  }

  return (
    <div className="flex h-full gap-0" style={{ minHeight: '600px' }}>

      {/* ── 왼쪽: 미션 목록 ── */}
      <div className="w-64 border-r border-gray-300 bg-gray-50 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-300 bg-white">
          <h2 className="text-base font-bold text-gray-800">💻 실습 미션</h2>
          <p className="text-xs text-gray-500 mt-1">
            완료: {Object.keys(completedMissions).length} / {content.missions.length}
          </p>
        </div>

        <div className="flex-1 p-3 space-y-2">
          {content.missions.map((mission) => {
            const isCompleted = completedMissions[mission.id];
            const isUnlocked = mission.id <= currentMission;
            const isSelected = selectedMission === mission.id;

            return (
              <button
                key={mission.id}
                onClick={() => isUnlocked && setSelectedMission(mission.id)}
                disabled={!isUnlocked}
                className={`w-full p-3 rounded-lg text-left text-sm transition ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : isUnlocked
                    ? 'bg-white border border-gray-300 text-gray-800 hover:bg-blue-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{isCompleted ? '✅' : isUnlocked ? '🔵' : '🔒'}</span>
                  <div>
                    <p className="font-semibold">미션 {mission.id}</p>
                    <p className={`text-xs mt-0.5 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                      {mission.title}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-gray-300">
          <p className="text-xs text-green-700 bg-green-50 rounded p-2 border border-green-200">
            💡 AI 튜터에게 질문하면 힌트를 받을 수 있어요!
          </p>
        </div>
      </div>

      {/* ── 오른쪽: 실습 화면 ── */}
      <div className="flex-1 overflow-y-auto p-5 bg-white">
        {activeMission ? (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                미션 {activeMission.id} / {content.missions.length}
              </span>
              <h3 className="text-xl font-bold text-gray-800 mt-2">{activeMission.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{activeMission.description}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs font-bold text-yellow-800 mb-1">💡 힌트</p>
              <p className="text-sm text-yellow-900">{activeMission.hint}</p>
            </div>

            <div>
              <p className="text-sm font-bold text-gray-800 mb-1">🐍 파이썬 코드 실행</p>
              <CodeRunner
                template={activeMission.template}
                key={activeMission.id}
                onResultChange={(result) => handleCodeResult(activeMission.id, result)}
              />
            </div>

            <button
              onClick={() => handleClickComplete(activeMission.id)}
              disabled={completedMissions[activeMission.id]}
              className={`w-full py-2.5 font-bold rounded-lg transition ${
                completedMissions[activeMission.id]
                  ? 'bg-green-500 text-white cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {completedMissions[activeMission.id] ? '✅ 완료됨' : '✔️ 미션 완료하기'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            왼쪽에서 미션을 선택하세요
          </div>
        )}
      </div>
    </div>
  );
}
