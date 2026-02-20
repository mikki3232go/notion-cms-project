# 개인 개발 블로그 (Notion CMS)

Notion을 CMS로 활용한 개인 기술 블로그입니다. Notion에서 글을 작성하면 자동으로 블로그에 반영됩니다.

## 기술 스택

| 기술 | 버전 | 설명 |
|------|------|------|
| Next.js | 15 | App Router, Server Components |
| React | 19 | 최신 React |
| TypeScript | 5 | 타입 안전성 |
| Tailwind CSS | v4 | 유틸리티 CSS |
| shadcn/ui | 최신 | UI 컴포넌트 라이브러리 |
| @notionhq/client | 최신 | Notion API 클라이언트 |
| Lucide React | 최신 | 아이콘 라이브러리 |

## 주요 기능

- Notion 데이터베이스와 연동한 블로그 글 목록
- 개별 글 상세 페이지 (Notion 블록 렌더링)
- 카테고리별 필터링
- 글 제목 및 태그 검색
- 반응형 디자인 (모바일/태블릿/데스크탑)

## 시작하기

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 값을 입력합니다.

```bash
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
```

### Notion 데이터베이스 구조

Notion 데이터베이스에 아래 프로퍼티를 설정합니다.

| 필드명 | 타입 | 설명 |
|--------|------|------|
| Title | title | 글 제목 |
| Category | select | 카테고리 |
| Tags | multi_select | 태그 목록 |
| Published | date | 발행일 |
| Status | select | `초안` / `발행됨` |

> `Status`가 `발행됨`인 글만 블로그에 표시됩니다.

### 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버: http://localhost:3000

### 프로덕션 빌드

```bash
npm run build
npm run start
```

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 홈 (글 목록)
│   ├── posts/
│   │   └── [id]/
│   │       └── page.tsx        # 글 상세 페이지
│   └── category/
│       └── [category]/
│           └── page.tsx        # 카테고리별 글 목록
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── blog/
│   │   ├── PostCard.tsx        # 글 카드 컴포넌트
│   │   ├── PostList.tsx        # 글 목록
│   │   └── NotionRenderer.tsx  # Notion 블록 렌더러
│   └── ui/                     # shadcn/ui 컴포넌트
└── lib/
    ├── notion.ts               # Notion API 클라이언트
    └── utils.ts                # 유틸리티 함수
```

## 배포

[Vercel](https://vercel.com)을 통해 배포합니다. 환경 변수(`NOTION_API_KEY`, `NOTION_DATABASE_ID`)를 Vercel 프로젝트 설정에 추가해야 합니다.

## 문서

- [PRD (제품 요구사항 문서)](./docs/PRD.md)
