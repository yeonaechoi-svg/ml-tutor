import React, { useState } from 'react';

export default function TeacherDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('students');

  const sampleStudents = [
    {
      id: 1,
      name: '홍길동',
      studentId: '20240001',
      currentStep: 3,
      currentMission: 2,
      chatCount: 5,
      lastAccess: '2025.05.19 14:23',
    },
    {
      id: 2,
      name: '김철수',
      studentId: '20240002',
      currentStep: 4,
      currentMission: 1,
      chatCount: 3,
      lastAccess: '2025.05.19 10:15',
    },
    {
      id: 3,
      name: '이영희',
      studentId: '20240003',
      currentStep: 3,
      currentMission: 5,
      chatCount: 8,
      lastAccess: '2025.05.18 16:45',
    },
  ];

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      {/* 헤더 */}
      <div className="bg-green-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">👨‍🏫 교사 대시보드</h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-300 bg-white">
        <button
          onClick={() => setActiveTab('students')}
          className={`flex-1 px-6 py-4 font-semibold text-center transition ${
            activeTab === 'students'
              ? 'border-b-4 border-green-600 text-green-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          📊 학생 현황
        </button>
        <button
          onClick={() => setActiveTab('journey')}
          className={`flex-1 px-6 py-4 font-semibold text-center transition ${
            activeTab === 'journey'
              ? 'border-b-4 border-green-600 text-green-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          📖 여정 열람
        </button>
        <button
          onClick={() => setActiveTab('evaluation')}
          className={`flex-1 px-6 py-4 font-semibold text-center transition ${
            activeTab === 'evaluation'
              ? 'border-b-4 border-green-600 text-green-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          ⭐ 상호평가 관리
        </button>
      </div>

      {/* 탭 내용 */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'students' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">학생 진행 현황</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                      이름
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                      학번
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                      현재 단계
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                      미션 진행
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                      AI 대화
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">
                      마지막 접속
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sampleStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-gray-800 font-semibold">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{student.studentId}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {student.currentStep}단계
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        미션 {student.currentMission}/5
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {student.chatCount}회
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {student.lastAccess}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'journey' && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">여정 열람</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-4">
                학생을 선택하면 해당 학생의 학습 여정을 상세히 확인할 수 있습니다.
              </p>
              <div className="space-y-3">
                {sampleStudents.map((student) => (
                  <button
                    key={student.id}
                    className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-blue-50 transition"
                  >
                    <p className="font-semibold text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {student.currentStep}단계 미션 {student.currentMission}/5
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">상호평가 관리</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-4">
                ⭐ 상호평가 기능은 v0.3에서 추가될 예정입니다.
              </p>
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-sm text-yellow-800">
                <strong>준비 중:</strong> 7단계 완료 후 학생 결과물 갤러리 및 익명 평가 시스템
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
