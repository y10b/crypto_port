# 🚀 가상자산 적금 투자 시뮬레이터

실제 업비트 과거 데이터를 활용하여 가상자산 적금식 투자 전략을 시뮬레이션하고 시각화하는 웹 애플리케이션입니다.

## ✨ 주요 기능

- 📊 **실시간 데이터 기반 시뮬레이션**: 업비트 API를 통한 실제 과거 가격 데이터 활용
- 💰 **적금식 투자 전략**: 일/주/월 단위 정기 투자 시뮬레이션
- 📈 **다중 코인 비교**: 여러 가상자산의 투자 성과 동시 비교
- 🎨 **인터랙티브 차트**: Chart.js 기반 시각화 및 토글 기능
- 📱 **반응형 UI**: 모바일부터 데스크톱까지 최적화된 사용자 경험
- ⏰ **자동 데이터 업데이트**: 매일 자동으로 최신 가격 데이터 수집

## 🛠 기술 스택

### Frontend

- **Next.js 15**: React 기반 풀스택 프레임워크
- **TypeScript**: 타입 안전성을 위한 정적 타입 시스템
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Chart.js**: 데이터 시각화 라이브러리
- **React Chart.js 2**: React용 Chart.js 래퍼

### Backend & Database

- **Prisma ORM**: 타입 안전한 데이터베이스 ORM
- **PostgreSQL**: 관계형 데이터베이스
- **업비트 API**: 실시간/과거 가격 데이터 소스

### 배포 & 인프라

- **Vercel**: 프론트엔드 배포 플랫폼
- **Render PostgreSQL**: 무료 데이터베이스 호스팅
- **Vercel Cron**: 서버리스 크론 작업

## 📋 지원 가상자산

- 비트코인 (BTC)
- 이더리움 (ETH)
- 솔라나 (SOL)
- 리플 (XRP)
- 에이다 (ADA)
- 도지코인 (DOGE)
- 페페 (PEPE)
- 트럼프 (TRUMP)
- 아발란체 (AVAX)
- 폴리곤 (MATIC)
- 폴카닷 (DOT)
- 체인링크 (LINK)

## 🚀 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- npm 또는 yarn
- PostgreSQL 데이터베이스

### 설치

1. **저장소 클론**

```bash
git clone https://github.com/your-username/cryptoweb.git
cd cryptoweb
```

2. **의존성 설치**

```bash
npm install
```

3. **환경 변수 설정**
   `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

4. **데이터베이스 설정**

```bash
# Prisma 마이그레이션 실행
npx prisma migrate dev

# Prisma 클라이언트 생성
npx prisma generate
```

5. **과거 데이터 백필 (선택사항)**

```bash
# 과거 가격 데이터 수집 (최대 200일)
npx ts-node scripts/backfillPrices.ts
```

6. **개발 서버 실행**

```bash
npm run dev
```

애플리케이션이 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 📖 사용법

1. **투자 조건 설정**

   - 투자할 가상자산 선택 (다중 선택 가능)
   - 투자 금액 입력
   - 투자 주기 선택 (일/주/월)

2. **시뮬레이션 실행**

   - "시뮬레이션 시작" 버튼 클릭
   - 과거 데이터 기반으로 적금식 투자 결과 계산

3. **결과 분석**
   - 각 코인별 투자 성과 비교
   - 차트에서 코인별 토글로 개별 분석
   - 투자금 대비 평가금액 및 수익률 확인

## 📁 프로젝트 구조

```
cryptoweb/
├── prisma/                 # 데이터베이스 스키마 및 마이그레이션
│   ├── schema.prisma      # Prisma 스키마 정의
│   └── migrations/        # 데이터베이스 마이그레이션 파일
├── scripts/               # 유틸리티 스크립트
│   ├── backfillPrices.ts  # 과거 데이터 백필 스크립트
│   └── fetchPrices.ts     # 일일 가격 수집 스크립트
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API 라우트
│   │   │   ├── cron/     # 크론 작업 엔드포인트
│   │   │   └── simulate/ # 시뮬레이션 API
│   │   ├── globals.css   # 전역 스타일
│   │   ├── layout.tsx    # 루트 레이아웃
│   │   └── page.tsx      # 메인 페이지
│   ├── components/       # React 컴포넌트
│   │   ├── ParamForm.tsx # 투자 조건 입력 폼
│   │   └── ResultChart.tsx # 결과 차트 컴포넌트
│   └── lib/              # 유틸리티 라이브러리
│       ├── prisma.ts     # Prisma 클라이언트
│       ├── simulator.ts  # 투자 시뮬레이션 로직
│       └── upbit.ts      # 업비트 API 클라이언트
├── public/               # 정적 파일
├── package.json          # 프로젝트 의존성
├── tsconfig.json         # TypeScript 설정
├── tailwind.config.js    # Tailwind CSS 설정
└── vercel.json           # Vercel 배포 설정
```

## 🔧 API 엔드포인트

### GET `/api/simulate`

투자 시뮬레이션을 실행합니다.

**쿼리 파라미터:**

- `markets`: 투자할 코인 목록 (쉼표로 구분)
- `amount`: 투자 금액
- `period`: 투자 주기 (`DAILY`, `WEEKLY`, `MONTHLY`)

**응답 예시:**

```json
{
  "KRW-BTC": {
    "timeline": [
      {
        "date": "2024-01-01",
        "evalPrice": 1000000,
        "cost": 100000,
        "roi": 0.1
      }
    ],
    "final": {
      "roi": 0.25,
      "cost": 1000000,
      "evalPrice": 1250000
    }
  }
}
```

### POST `/api/cron`

일일 가격 데이터를 수집합니다. (Vercel Cron에서 자동 실행)

## 🌐 배포

이 프로젝트는 Vercel과 Render를 사용하여 배포됩니다:

1. **Render에서 PostgreSQL 데이터베이스 생성**
2. **Vercel에 프로젝트 배포**
3. **환경 변수 설정**
4. **자동 크론 작업 활성화**

자세한 배포 가이드는 [Vercel 문서](https://vercel.com/docs)를 참조하세요.


⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!
