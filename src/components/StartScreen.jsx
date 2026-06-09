import React, { useState } from 'react';

export default function StartScreen({ onStartStudent, onStartTeacher }) {
  const [mode, setMode] = useState(null);
  const [classCode, setClassCode] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [teacherCode, setTeacherCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!classCode.trim() || !name.trim() || !studentId.trim()) return;
    setLoading(true);
    await onStartStudent(name.trim(), studentId.trim(), classCode.trim());
    setLoading(false);
  };

  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    if (teacherCode.trim() === 'teacher2025') {
      onStartTeacher();
    } else {
      alert('교사 코드가 잘못되었습니다.');
    }
  };

  // 메인 선택 화면
  if (mode === null) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">🤖 ML 튜터</h1>
          <p className="text-xl text-gray-600 mb-12">
            기계학습 수업을 위한 AI 튜터 서비스
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setMode('student')}
              className="w-64 px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition block mx-auto"
            >
              👨‍🎓 학생으로 시작
            </button>
            <button
              onClick={() => setMode('teacher')}
              className="w-64 px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition block mx-auto"
            >
              👨‍🏫 교사로 시작
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 학생 로그인 화면
  if (mode === 'student') {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">학생 로그인</h2>
          <p className="text-gray-500 text-sm mb-6">
            선생님께 받은 수업 코드를 입력하세요.
          </p>

          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                수업 코드 *
              </label>
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="예: info2025_1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이름 *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                학번 *
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="예: 20240001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? '불러오는 중...' : '시작하기'}
              </button>
              <button
                type="button"
                onClick={() => setMode(null)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                뒤로가기
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            같은 수업 코드 + 학번으로 재접속하면 진행 상황이 복원됩니다.
          </p>
        </div>
      </div>
    );
  }

  // 교사 로그인 화면
  if (mode === 'teacher') {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">교사 로그인</h2>
          <p className="text-gray-600 mb-6">교사 코드를 입력해주세요.</p>
          <form onSubmit={handleTeacherSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                교사 코드 *
              </label>
              <input
                type="password"
                value={teacherCode}
                onChange={(e) => setTeacherCode(e.target.value)}
                placeholder="교사 코드 입력"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="pt-4 space-y-2">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
              >
                로그인하기
              </button>
              <button
                type="button"
                onClick={() => setMode(null)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                뒤로가기
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
