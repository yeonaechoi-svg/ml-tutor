export const step3Content = {
  stepId: 3,
  stepName: '데이터 전처리',

  // 단계별 추천 질문 (ARS 방식)
  suggestedQuestions: {
    learn: [
      '결측치가 뭔지 잘 모르겠어요.',
      '이상치는 왜 제거해야 하나요?',
      'isnull()과 dropna()의 차이가 뭔가요?',
      '데이터 타입 변환은 왜 필요한가요?',
    ],
    quiz: [
      '퀴즈 1번 힌트를 주세요.',
      '퀴즈 2번 힌트를 주세요.',
      '퀴즈 3번 힌트를 주세요.',
      '결측치 관련 함수가 헷갈려요.',
    ],
    missions: {
      1: [
        'pd.read_csv()는 어떻게 사용하나요?',
        '파일 이름은 어디에 입력하나요?',
        'CSV 파일이 없으면 어떻게 하나요?',
        '오류가 났어요, 어떻게 하나요?',
      ],
      2: [
        'df.shape는 무엇을 알려주나요?',
        'df.info()와 df.head()의 차이가 뭔가요?',
        '컬럼이 너무 많아서 보기 어려워요.',
        '행과 열이 각각 몇 개인지 어떻게 확인하나요?',
      ],
      3: [
        '결측치가 몇 개인지 어떻게 확인하나요?',
        'dropna()와 fillna() 중 어떤 걸 써야 하나요?',
        '평균값으로 채우려면 어떻게 하나요?',
        '특정 컬럼만 결측치 처리하려면?',
      ],
      4: [
        'describe()에서 어떤 값을 봐야 하나요?',
        'min, max 값이 이상한지 어떻게 판단하나요?',
        '이상치를 발견했는데 어떻게 처리하나요?',
        'IQR 방식이 뭔가요?',
      ],
      5: [
        'object 타입과 float 타입의 차이가 뭔가요?',
        'astype()은 어떻게 사용하나요?',
        '문자형 컬럼을 숫자로 바꾸려면?',
        '타입 변환 후 확인하는 방법은?',
      ],
    },
  },

  learn: [
    {
      id: 1,
      title: '결측치(NaN)란?',
      description: '데이터에서 값이 비어있는 경우를 결측치라고 합니다. 데이터 분석 시 정확도를 떨어뜨리므로 적절히 처리해야 합니다.',
      code: `import pandas as pd

# 결측치 확인
df.isnull().sum()

# 결측치가 있는 행 제거
df = df.dropna()

# 결측치를 평균값으로 채우기
df = df.fillna(df.mean())`,
    },
    {
      id: 2,
      title: '이상치(Outlier) 탐지',
      description: '데이터의 전반적인 패턴에서 크게 벗어난 값을 이상치라고 합니다. 이상치를 제거하거나 따로 처리해야 합니다.',
      code: `# 기술통계로 이상치 탐색
df.describe()

# boxplot으로 시각화
import matplotlib.pyplot as plt
df.boxplot()
plt.show()

# IQR을 이용한 이상치 탐지
Q1 = df.quantile(0.25)
Q3 = df.quantile(0.75)
IQR = Q3 - Q1
df = df[(df >= Q1 - 1.5 * IQR) & (df <= Q3 + 1.5 * IQR)]`,
    },
    {
      id: 3,
      title: '데이터 타입 변환',
      description: '문자열로 저장된 숫자 등을 올바른 타입으로 변환하여 분석에 용이하게 합니다.',
      code: `# 데이터 타입 확인
print(df.dtypes)

# 숫자형으로 변환
df['컬럼명'] = df['컬럼명'].astype(float)

# 문자형 → 숫자형 (레이블 인코딩)
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
df['컬럼명'] = le.fit_transform(df['컬럼명'])`,
    },
  ],

  quiz: [
    {
      id: 1,
      question: '결측치를 확인하는 함수는 무엇인가요?',
      options: ['isnull()', 'dropna()', 'fillna()', 'describe()'],
      answer: 0,
    },
    {
      id: 2,
      question: '결측치가 있는 행을 제거하는 함수는 무엇인가요?',
      options: ['isnull()', 'dropna()', 'fillna()', 'astype()'],
      answer: 1,
    },
    {
      id: 3,
      question: '결측치를 특정 값으로 채우는 함수는 무엇인가요?',
      options: ['isnull()', 'dropna()', 'fillna()', 'describe()'],
      answer: 2,
    },
  ],

  missions: [
    {
      id: 1,
      title: 'CSV 파일 불러오기',
      description: '분석할 CSV 파일을 pandas로 불러오세요.',
      hint: 'pd.read_csv() 함수를 사용해보세요. 괄호 안에는 무엇이 들어갈까요?',
      template: `import pandas as pd

df = pd.read_csv('_____.csv')
print(df.head())`,
    },
    {
      id: 2,
      title: '데이터 구조 확인',
      description: '불러온 데이터의 크기와 구조를 확인하세요.',
      hint: 'df.shape, df.info(), df.head() 를 각각 실행해보세요. 어떤 정보를 알 수 있나요?',
      template: `# 데이터 크기 확인
print(df.shape)

# 컬럼 정보 확인
df.info()

# 상위 5행 확인
print(df.head())`,
    },
    {
      id: 3,
      title: '결측치 확인 및 처리',
      description: '데이터에 결측치가 있는지 확인하고 처리하세요.',
      hint: '먼저 isnull().sum()으로 결측치 개수를 확인해보세요. 몇 개나 있나요?',
      template: `# 결측치 확인
print(df.isnull().sum())

# 결측치 처리 (행 제거 또는 채우기)
df = df._____`,
    },
    {
      id: 4,
      title: '이상치 탐색',
      description: '데이터에 이상치가 있는지 확인하세요.',
      hint: 'df.describe()로 기술통계를 확인해보세요. min, max 값이 이상하지 않나요?',
      template: `# 기술통계로 이상치 탐색
print(df.describe())`,
    },
    {
      id: 5,
      title: '데이터 타입 확인 및 변환',
      description: '각 컬럼의 데이터 타입을 확인하고 필요시 변환하세요.',
      hint: 'df.dtypes로 각 컬럼의 타입을 확인해보세요. 숫자여야 하는데 object 타입인 컬럼이 있나요?',
      template: `# 데이터 타입 확인
print(df.dtypes)

# 타입 변환이 필요한 컬럼 변환
df['컬럼명'] = df['컬럼명'].astype(_____)`,
    },
  ],
};
