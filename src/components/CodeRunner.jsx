import React, { useState, useRef } from 'react';
import usePyodide from '../hooks/usePyodide';

export default function CodeRunner({ template }) {
  const { status, runCode } = usePyodide();
  const [code, setCode] = useState(template || '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  const fileInputRef = useRef(null);

  const handleRun = async () => {
    setRunning(true);
    setOutput('');
    setError('');
    setHasRun(false);
    try {
      const result = await runCode(code, csvFile);
      setOutput(result.output);
      setError(result.error);
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
      setHasRun(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      setCode((prev) => prev.replace(/_+\.csv/g, file.name));
    }
  };

  const statusLabel = {
    idle: '파이썬 환경 준비 중...',
    loading: '⏳ 파이썬 패키지 로딩 중 (최초 1회, 약 20~30초)...',
    ready: null,
    error: '❌ 파이썬 환경 로드 실패. 새로고침 해주세요.',
  }[status];

  return (
    <div className="space-y-3">
      {/* 상태 메시지 */}
      {statusLabel && (
        <div className={`text-sm px-3 py-2 rounded ${
          status === 'error'
            ? 'bg-red-100 text-red-700'
            : 'bg-yellow-50 text-yellow-800 border border-yellow-300'
        }`}>
          {statusLabel}
        </div>
      )}

      {/* CSV 파일 업로드 */}
      <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
        <button
          onClick={() => fileInputRef.current.click()}
          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded hover:bg-gray-50 transition shadow-sm"
        >
          📂 CSV 파일 선택
        </button>
        <span className={`text-xs font-medium ${csvFile ? 'text-green-700' : 'text-gray-500'}`}>
          {csvFile ? `✅ ${csvFile.name}` : '파일 미선택'}
        </span>
        <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
      </div>

      {/* ── 코드 에디터 ── */}
      <div className="rounded-lg overflow-hidden border border-[#3c3c5c] shadow-lg">
        {/* 코드창 헤더 */}
        <div className="relative flex items-center justify-center px-4 py-2 bg-[#2d2b55]">
          <div className="absolute left-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
          </div>
          <span className="text-xs text-[#a09abb] font-mono font-bold">📝 코드 편집기</span>
        </div>
        {/* 코드 입력창 */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={Math.max(6, code.split('\n').length + 1)}
          spellCheck={false}
          className="w-full p-4 font-mono text-sm resize-y focus:outline-none"
          style={{
            backgroundColor: '#1e1e2e',
            color: '#cdd6f4',
            caretColor: '#cba6f7',
            lineHeight: '1.6',
          }}
        />
      </div>

      {/* 실행 버튼 */}
      <button
        onClick={handleRun}
        disabled={status !== 'ready' || running}
        className="w-full py-2.5 font-bold rounded-lg transition text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: status === 'ready' && !running ? '#a855f7' : '#6b7280',
          color: '#ffffff',
        }}
      >
        {running ? '⏳ 실행 중...' : '▶ 코드 실행'}
      </button>

      {/* ── 실행 결과창 ── */}
      {hasRun && (
        <div className="rounded-lg overflow-hidden border shadow-lg"
          style={{ borderColor: error ? '#6b1111' : '#1a3a2a' }}
        >
          {/* 결과창 헤더 */}
          <div className="flex items-center justify-center px-4 py-2"
            style={{ backgroundColor: error ? '#3b0f0f' : '#0d1f17' }}
          >
            <span className="text-xs font-mono font-bold"
              style={{ color: error ? '#ff6b6b' : '#39d353' }}
            >
              {error ? '❌ 오류 출력' : '✅ 실행 결과'}
            </span>
          </div>
          {/* 결과 내용 */}
          <div
            className="p-4 font-mono text-sm whitespace-pre-wrap min-h-12"
            style={{
              backgroundColor: '#0d1117',
              color: error ? '#ff6b6b' : '#39d353',
              lineHeight: '1.6',
            }}
          >
            {error ? error : output}
          </div>
        </div>
      )}
    </div>
  );
}
