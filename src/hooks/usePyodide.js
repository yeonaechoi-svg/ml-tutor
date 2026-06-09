import { useState, useEffect, useRef } from 'react';

export default function usePyodide() {
  const [status, setStatus] = useState('idle');
  const pyodideRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function initPyodide() {
      setStatus('loading');
      try {
        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full/',
        });
        await pyodide.loadPackage(['pandas', 'numpy']);
        if (!cancelled) {
          pyodideRef.current = pyodide;
          setStatus('ready');
        }
      } catch (err) {
        console.error('Pyodide 로드 실패:', err);
        if (!cancelled) setStatus('error');
      }
    }

    initPyodide();
    return () => { cancelled = true; };
  }, []);

  const runCode = async (code, csvFile = null) => {
    const pyodide = pyodideRef.current;
    if (!pyodide) throw new Error('Pyodide가 아직 준비되지 않았습니다.');

    // CSV 파일을 가상 파일 시스템에 마운트
    if (csvFile) {
      const buffer = await csvFile.arrayBuffer();
      pyodide.FS.writeFile(csvFile.name, new Uint8Array(buffer));
    }

    let output = '';
    let error = '';

    try {
      // stdout 캡처 설정
      pyodide.runPython(`
import sys, io
__buf = io.StringIO()
sys.stdout = __buf
`);

      // 코드 실행 (비동기)
      await pyodide.runPythonAsync(code);

      output = pyodide.runPython('__buf.getvalue()');
      if (!output) output = '(출력 없음 — print()를 사용해보세요)';

    } catch (err) {
      // 에러가 나도 캡처된 stdout 표시
      try { output = pyodide.runPython('__buf.getvalue()'); } catch {}
      error = err.message;
    } finally {
      try { pyodide.runPython('sys.stdout = sys.__stdout__'); } catch {}
    }

    return { output, error };
  };

  return { status, runCode };
}
