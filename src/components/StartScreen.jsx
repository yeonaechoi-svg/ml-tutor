import React, { useState } from 'react';

export default function StartScreen({
  onStartStudent,
  onStartTeacher,
  onGoogleLogin,
  isFirebaseEnabled,
}) {
  const [mode, setMode] = useState(null);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [teacherCode, setTeacherCode] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && studentId.trim()) {
      onStartStudent(name.trim(), studentId.trim());
    }
  };

  const handleGoogleLogin = async () => {
    if (!name.trim() || !studentId.trim()) {
      alert('이름과 학번을 먼저 입력해주세요.\n(이미 로그인한 적 있다면 비워도 됩니다.)');
    }
    setGoogleLoading(true);
    try {
      await onGoogleLogin(name.trim(), studentId.trim());
    } catch (e) {
      console.error('구글 로그인 실패:', e);
      alert('구글 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setGoogleLoading(false);
    }
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
              className="w-64 px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition"
            >
              👨‍🎓 학생으로 시작
            </button>
            <br />
            <button
              onClick={() => setMode('teacher')}
              className="w-64 px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition"
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
          <p className="text-gray-600 mb-6">정보를 입력하고 로그인하세요.</p>

          <form onSubmit={handleStudentSubmit} className="space-y-4">
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

            <div className="pt-4 space-y-3">
              {isFirebaseEnabled ? (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full px-4 py-3 bg-white border-2 border-blue-500 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {googleLoading ? (
                      '로그인 중...'
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        구글 계정으로 로그인 (데이터 저장)
                      </>
                    )}
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border-t border-gray-200" />
                    <span className="text-xs text-gray-400">또는</span>
                    <div className="flex-1 border-t border-gray-200" />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition text-sm"
                  >
                    저장 없이 바로 시작 (MVP 모드)
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                >
                  시작하기
                </button>
              )}
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
