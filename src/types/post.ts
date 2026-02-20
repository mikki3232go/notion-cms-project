// 블로그 포스트 및 카테고리 공통 타입 정의

/**
 * Notion 데이터베이스 한 행(글 한 편)을 표현하는 타입.
 * lib/notion.ts의 fetchPages()가 이 형태로 변환하여 반환한다.
 */
export interface Post {
  /** Notion 페이지 ID (URL에서 사용) */
  id: string;
  /** 글 제목 */
  title: string;
  /** 카테고리 (없으면 null) */
  category: string | null;
  /** 태그 목록 */
  tags: string[];
  /** 발행일 — ISO 8601 날짜 문자열 (없으면 null) */
  publishedAt: string | null;
  /** 발행 상태: '발행됨' | '초안' */
  status: string;
}

/** 카테고리명 문자열 타입 */
export type Category = string;
