const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 1000;

export const callClaudeAPI = async (
  userMessage,
  stepNumber,
  stepName,
  currentTab,
  missionNumber = null,
  missionName = null
) => {
  const apiKey = process.env.REACT_APP_CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error('Claude API 키가 설정되지 않았습니다. .env 파일을 확인하세요.');
  }

  // 시스템 프롬프트 구성
  let systemPrompt = `당신은 고등학교 정보 교과 기계학습 수업의 AI 튜터입니다.

현재 학생 상태:
- 단계: ${stepNumber}단계 - ${stepName}
- 현재 탭: ${currentTab === 'learn' ? '학습' : currentTab === 'quiz' ? '퀴즈' : currentTab === 'mission' ? '실습' : '여정'}`;

  if (missionNumber && missionName) {
    systemPrompt += `\n- 현재 미션: ${missionNumber}번 - ${missionName}`;
  }

  systemPrompt += `

응답 원칙:
1. 절대로 완성된 정답 코드를 직접 제공하지 않는다.
2. 힌트와 유도 질문으로만 응답한다.
3. 현재 단계/미션 범위를 벗어난 질문은 현재 단계로 집중 유도한다.
4. 학습 탭에서는 해당 단계 학습 내용 관련 질문에만 응답한다.
5. 학생이 스스로 생각하고 코드를 수정하도록 격려한다.
6. 최대 2-3개의 짧은 문장으로 응답한다.`;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Claude API 오류: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API 호출 중 오류 발생:', error);
    throw error;
  }
};
