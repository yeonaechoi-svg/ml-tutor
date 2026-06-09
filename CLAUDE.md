# CLAUDE.md — ML 튜터 서비스

## 프로젝트 목적 및 주요 기능 요약

고등학교 정보 교과에서 데이터 기반 기계학습 모델 구현을 학습하는 학생들을 위한
AI 튜터 및 멘토형 웹 서비스입니다.

### 핵심 철학
- 정답 코드를 직접 제공하지 않음
- 인지적 비계(Scaffolding) 방식으로 학생이 스스로 해결하도록 유도
- 기존 AI 챗봇과의 차별점: 현재 수업 단계와 미션 맥락을 인식한 구조화된 AI 튜터

### 주요 기능
1. 3패널 레이아웃 (진행패널 + 가이드패널 + AI튜터 채팅)
2. 7단계 수업 흐름: 학습 → 퀴즈 통과 → 실습 미션 순차 수행
3. AI 튜터: 현재 단계+미션 맥락 인식, 힌트만 제공
4. 실습 탭 좌우 분할: 좌측 미션 가이드 + 우측 파이썬 코드 실행
5. 브라우저 내 파이썬 실행: Pyodide + CSV 파일 업로드
6. 학생 여정 타임라인: 자동 저장 + 학생 직접 입력 + 이미지 업로드 (v0.2)
7. 갤러리 + 상호평가: 7단계 완료 후 학생 결과물 공유 및 익명 평가 (v0.3)
8. 교사 대시보드: 학생 현황 실시간 확인 (v0.4)

---

## 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| 프론트엔드 | React + Tailwind CSS (CDN) | 단일 페이지 앱 |
| AI 엔진 | Claude API (`claude-sonnet-4-20250514`) | 스캐폴딩 시스템 프롬프트 |
| 파이썬 실행 | Pyodide v0.25.1 (CDN) | 브라우저 내 실행, pandas/numpy 지원 |
| 인증/저장 | Firebase Auth + Firestore (v0.2+) | |
| 파일 저장 | Firebase Storage (v0.2+) | CSV 파일 차시 간 유지 |
| 이미지 저장 | 학생 구글 드라이브 (링크만 Firestore에 저장) | |
| 배포 | 브라우저에서 바로 실행 (MVP), Vercel (v1.0) | |

---

## 폴더 구조

```
ml-tutor/
├── CLAUDE.md
├── .env                          # REACT_APP_CLAUDE_API_KEY
├── package.json
├── public/
│   └── index.html                # Tailwind CDN + Pyodide CDN 포함
└── src/
    ├── App.jsx                   # 메인 상태 관리 + 라우팅
    ├── index.jsx
    ├── index.css
    ├── setupProxy.js             # Claude API CORS 프록시 (개발용)
    ├── components/
    │   ├── StartScreen.jsx       # 시작 화면 (학생/교사 분기)
    │   ├── MainLayout.jsx        # 3패널 레이아웃
    │   ├── ProgressPanel.jsx     # 좌측 7단계 진행 패널
    │   ├── GuidePanel.jsx        # 중앙 탭 컨테이너
    │   ├── TutorChat.jsx         # 우측 AI 튜터 채팅
    │   ├── CodeRunner.jsx        # 파이썬 코드 실행 컴포넌트
    │   ├── tabs/
    │   │   ├── LearnTab.jsx      # 학습 탭 (개념 카드)
    │   │   ├── QuizTab.jsx       # 퀴즈 탭 (객관식 3문제)
    │   │   ├── MissionTab.jsx    # 실습 탭 (좌우 분할 + CodeRunner)
    │   │   └── JourneyTab.jsx    # 여정 탭 (v0.2 구현 예정)
    │   └── teacher/
    │       └── TeacherDashboard.jsx
    ├── data/
    │   ├── step3_content.js      # 3단계 샘플 콘텐츠 (학습/퀴즈/미션)
    │   └── steps_index.js        # 7단계 목록
    ├── hooks/
    │   └── usePyodide.js         # Pyodide 초기화 및 코드 실행 훅
    └── utils/
        └── claudeApi.js          # Claude API 호출 유틸
```

---

## 개발 시 지켜야 할 규칙과 주의사항

### Claude API 호출 규칙
- 모델: `claude-sonnet-4-20250514` 고정
- max_tokens: 1000 고정
- API 키는 반드시 환경변수(`.env`)에서 로드, 하드코딩 절대 금지
- MVP: `anthropic-dangerous-direct-browser-access: true` 헤더로 직접 호출
- v1.0 배포 시: 반드시 백엔드 서버를 통해 API 키 보호
- 시스템 프롬프트에 반드시 포함할 것:
  - 현재 단계 번호 및 단계명
  - 현재 미션 번호 및 미션명
  - 현재 탭 (학습/실습)
  - 스캐폴딩 원칙 (정답 직접 제공 금지)

### AI 튜터 응답 원칙
- 정답 코드를 직접 제공하지 않는다
- 힌트와 유도 질문으로만 응답한다
- 현재 단계/미션 범위를 벗어난 질문은 현재 단계로 유도한다
- 학습 탭에서는 해당 단계 학습 내용 관련 질문에만 응답한다

### Pyodide 파이썬 실행 규칙
- Pyodide CDN은 `public/index.html`에 추가
- 지원 패키지: `pandas`, `numpy` (loadPackage로 로드)
- `matplotlib` 사용 불가 (브라우저 환경 제약) → 코드 템플릿에서 제외
- 코드 템플릿의 모든 출력은 반드시 `print()` 명시
  - ❌ `df.head()` → ✅ `print(df.head())`
- CSV 파일: 학생 업로드 → Pyodide 가상 파일 시스템에 마운트
- CSV 파일 유지: 현재 세션 내에서만 유지 (v0.2에서 Firebase Storage로 영구 저장)
- 파일명 자동 치환: `_+\.csv` 패턴을 실제 파일명으로 교체

### 실습 탭 레이아웃 규칙
- 좌우 분할 구조 유지
  - 좌측 (w-64): 미션 목록 + 힌트 + AI 튜터 안내
  - 우측 (flex-1): 미션 제목/설명 + CodeRunner (CSV 업로드 + 코드 편집기 + 실행 결과)
- 코드 편집기 디자인: VS Code 스타일
  - 코드창: `#1e1e2e` 배경, `#cdd6f4` 글자
  - 결과창: `#0d1117` 배경, `#39d353` 초록 글자
  - 오류 시: `#3b0f0f` 배경, `#ff6b6b` 빨간 글자
  - 헤더 텍스트: 가운데 정렬

### 저장 관련 규칙
- MVP: React useState만 사용 (localStorage/sessionStorage 사용 금지)
- v0.2+: Firebase Firestore 사용
- 이미지: 학생 구글 드라이브 저장, Firestore에는 URL 링크만 저장
- 이미지 업로드 시 200KB 이하로 자동 압축
- 단계당 이미지 업로드 최대 5장 제한

### UI/UX 규칙
- position: fixed 사용 금지 (iframe 레이아웃 깨짐)
- 모든 색상은 CSS 변수 사용 (다크모드 대응)
- 반응형: 교실 PC(1280px 이상) + 스마트폰(360px 이상) 대응
- 퀴즈 통과 전까지 실습 탭 잠금 상태 유지
- 미션은 순차적으로만 해제 (이전 미션 완료 후 다음 미션 활성화)

### 콘텐츠 데이터 구조
- 모든 단계별 콘텐츠는 `src/data/` 폴더에 JS 파일로 분리
- 콘텐츠 구조:
```js
{
  stepId: 3,
  stepName: "데이터 전처리",
  learn: [ { id, title, description, code } ],
  quiz: [ { id, question, options, answer } ],
  missions: [ { id, title, description, hint, template } ]
}
```

### 현재 개발 단계
- ✅ MVP (v0.1): 완료 — 3단계 샘플 콘텐츠 + Pyodide 코드 실행 + 좌우 분할 실습 탭
- 다음 단계: Firebase 연동 (v0.2)

### 참고 사항
- 학교 PC 환경: 재부팅 시 브라우저 데이터 초기화됨 → 반드시 서버 저장 필요
- 학생 수: 최대 300명 기준 설계
- 수업 환경: 교실 PC + 학생 스마트폰 모두 지원
- 교사 코드 (MVP 하드코딩): `teacher2025` → v0.2에서 Firebase로 관리 예정
