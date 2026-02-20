# 개발 가이드라인 (AI Agent용)

## 1. 프로젝트 개요

- **목적**: Notion을 CMS로 활용한 개인 기술 블로그
- **기술 스택**: Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS v4, shadcn/ui, Lucide React
- **CMS**: Notion API (`@notionhq/client`) — 서버 사이드 전용
- **배포**: Vercel
- **경로 별칭**: `@/*` → `./src/*`

---

## 2. 디렉토리 구조 및 파일 위치 규칙

```
src/
├── app/                     # Next.js App Router 페이지
│   ├── layout.tsx           # 루트 레이아웃 (Header, Footer, ThemeProvider 포함)
│   ├── page.tsx             # 홈 (글 목록, 카테고리 필터, 검색)
│   ├── posts/[id]/          # 글 상세 페이지
│   └── category/[category]/ # 카테고리별 글 목록
├── components/
│   ├── layout/              # Header.tsx, Footer.tsx (레이아웃 전용)
│   ├── providers/           # ThemeProvider.tsx 등 Context Provider
│   ├── ui/                  # shadcn/ui 컴포넌트 (자동 생성, 직접 수정 최소화)
│   └── (기능별 컴포넌트)     # PostCard.tsx, NotionRenderer.tsx, CategoryFilter.tsx 등
├── lib/
│   ├── utils.ts             # cn() 유틸 (수정 금지)
│   └── notion.ts            # Notion API 함수 전용 파일
├── hooks/                   # 커스텀 훅 (useDebounce.ts 등)
└── types/                   # TypeScript 타입 정의 전용
    ├── post.ts              # Post, Category 타입
    └── notion.ts            # NotionBlock 등 Notion 관련 타입
```

### 파일 위치 결정 규칙
- Notion API 호출 함수 → `src/lib/notion.ts`에만 작성
- 페이지 컴포넌트 → `src/app/[경로]/page.tsx`
- 재사용 UI 컴포넌트 → `src/components/[이름].tsx`
- shadcn/ui 컴포넌트 추가 → `npx shadcn add [컴포넌트명]` 명령 사용, `src/components/ui/`에 자동 생성
- 커스텀 훅 → `src/hooks/use[이름].ts`
- 전역 타입 → `src/types/[도메인].ts`

---

## 3. Notion API 사용 규칙

### 반드시 지켜야 할 규칙
- Notion API 함수는 **서버 컴포넌트** 또는 **Route Handler**에서만 호출한다
- `NOTION_API_KEY`, `NOTION_DATABASE_ID` 환경변수를 클라이언트 코드에 절대 노출하지 않는다
- `NEXT_PUBLIC_` 접두사를 Notion 관련 환경변수에 사용하지 않는다
- 모든 Notion API 함수는 `src/lib/notion.ts`에 집중한다

### 구현할 핵심 함수 (`src/lib/notion.ts`)
```
fetchPages()           → Status가 '발행됨'인 글 목록, Published 내림차순
fetchPageContent(id)   → 특정 페이지의 블록 콘텐츠
fetchCategories()      → 카테고리 목록 동적 조회
```

### Notion 데이터베이스 필드
| 필드명 | 타입 | 비고 |
|--------|------|------|
| Title | title | 글 제목 |
| Category | select | 카테고리 |
| Tags | multi_select | 태그 목록 |
| Published | date | 발행일 |
| Status | select | `초안` / `발행됨` |

---

## 4. TypeScript 타입 규칙

- `any` 타입 **절대 사용 금지**
- `unknown` 사용 후 타입 가드로 좁히기
- Notion API 응답 타입은 `@notionhq/client`의 공식 타입 활용
- 인터페이스/타입은 `src/types/`에 정의하고 import하여 사용

### 핵심 타입 정의 위치
- `src/types/post.ts` → `Post`, `Category` 타입
- `src/types/notion.ts` → `NotionBlock` 및 블록 관련 타입

---

## 5. 컴포넌트 작성 규칙

- 컴포넌트명: PascalCase, 파일명도 동일
- Notion API를 직접 호출하는 컴포넌트는 Server Component (최상단에 `"use client"` 없음)
- 상태 관리나 이벤트 핸들러가 있으면 `"use client"` 선언 필수
- shadcn/ui 컴포넌트를 우선 사용하고, 없는 경우에만 직접 구현
- 모든 컴포넌트는 모바일(375px) → 태블릿(768px) → 데스크탑(1280px) 반응형 필수

### 반응형 브레이크포인트 우선순위
```
기본(모바일) → md:(768px) → lg:(1280px)
```

---

## 6. 라우팅 규칙 (App Router)

- 페이지 파일: `src/app/[경로]/page.tsx`
- 레이아웃 변경: `src/app/layout.tsx` (루트 레이아웃, Header/Footer 포함)
- 동적 라우트: `src/app/posts/[id]/page.tsx`, `src/app/category/[category]/page.tsx`
- ISR 적용 시 `export const revalidate = 3600` (초 단위) 페이지 파일 상단에 선언
- SSG 적용 시 `generateStaticParams()` 함수 export

---

## 7. 스타일링 규칙

- Tailwind CSS v4 유틸리티 클래스 사용
- 인라인 스타일 사용 금지
- CSS 변수는 `src/app/globals.css`에 정의 (shadcn/ui 테마 변수 준수)
- 클래스 병합 시 `cn()` 함수 사용 (`src/lib/utils.ts`)
- 다크 모드: `next-themes` + `ThemeProvider` 이미 구현됨, `dark:` 접두사로 스타일 추가

---

## 8. 파일 상호작용 규칙

### 새 페이지 추가 시
1. `src/app/[경로]/page.tsx` 생성
2. 필요 시 `src/components/` 하위에 전용 컴포넌트 생성
3. 타입이 필요하면 `src/types/`에 추가
4. Header.tsx의 `navLinks`에 네비게이션 링크 추가 여부 검토

### Notion API 함수 추가 시
1. `src/lib/notion.ts`에 함수 추가
2. `src/types/`에 반환 타입 정의 추가
3. 해당 함수를 사용하는 페이지(Server Component)에서 import

### shadcn/ui 컴포넌트 추가 시
1. `npx shadcn add [컴포넌트명]` 실행 → `src/components/ui/` 자동 생성
2. 직접 `src/components/ui/` 파일 생성 금지

### 환경변수 추가 시
1. `.env.local`에 변수 추가
2. `NEXT_PUBLIC_` 접두사는 클라이언트에서 사용하는 변수에만 허용
3. Notion 관련 변수는 절대 `NEXT_PUBLIC_` 사용 금지

---

## 9. AI 의사결정 기준

### Server Component vs Client Component
- Notion API 호출 필요 → **Server Component** (기본값)
- useState, useEffect, 이벤트 핸들러 필요 → **Client Component** (`"use client"` 선언)
- 검색/필터 등 인터랙티브 UI → **Client Component**

### 새 컴포넌트 생성 vs 기존 컴포넌트 수정
- 동일 도메인의 변형 → 기존 컴포넌트에 props 추가
- 완전히 다른 역할 → 새 컴포넌트 생성

### 데이터 패칭 전략
- 글 목록/상세 → ISR (`revalidate = 3600`)
- 빌드 시 경로가 정해지는 페이지 → SSG (`generateStaticParams`)
- 실시간 필요 없음 → 서버 사이드 렌더링 우선

### 검색/필터 구현
- 클라이언트 사이드 필터링 사용 (별도 API 호출 없음)
- `useDebounce` 훅 활용 (`src/hooks/useDebounce.ts` 이미 구현됨)

---

## 10. 금지 사항

- `any` 타입 사용 금지
- `NEXT_PUBLIC_NOTION_*` 환경변수 사용 금지 (Notion 키 클라이언트 노출 방지)
- Notion API를 Client Component에서 직접 호출 금지
- `src/components/ui/` 파일 직접 생성/수정 최소화 (shadcn 명령어 사용)
- 인라인 스타일(`style={{}}`) 사용 금지
- 이미지에 `alt` 속성 누락 금지
- `src/lib/utils.ts`의 `cn()` 함수 수정 금지
- 비시맨틱 태그(`div`, `span`) 남용 금지 — `article`, `section`, `nav`, `header`, `footer`, `main` 우선 사용
- 컴포넌트에 한국어 주석 없이 복잡한 로직 작성 금지
