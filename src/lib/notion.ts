// 이 파일은 서버 사이드에서만 실행됩니다. Client Component에서 import 금지.
// Notion API v5(@notionhq/client ^5.x) 기반. databases.query가 제거되어
// dataSources.query를 사용한다.

import { Client, isFullBlock, isFullPage } from "@notionhq/client";
import type {
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { Post, Category } from "@/types/post";
import type { NotionBlock } from "@/types/notion";

// Notion 클라이언트 인스턴스 — 서버 사이드 환경변수만 사용
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// NOTION_DATABASE_ID는 dataSources.query의 data_source_id로 사용
const DATA_SOURCE_ID = process.env.NOTION_DATABASE_ID!;

// ---------------------------------------------------------------------------
// 내부 헬퍼: PageObjectResponse → Post 변환
// ---------------------------------------------------------------------------

/**
 * Notion 페이지 응답 객체에서 블로그 포스트에 필요한 필드만 추출한다.
 * Notion properties의 타입이 복잡한 유니온이므로 type narrowing으로 안전하게 접근한다.
 */
function pageToPost(page: PageObjectResponse): Post {
  const props = page.properties;

  // --- Title ---
  // Title 필드는 'title' 타입: TitleArrayBasedPropertyValueResponse
  const titleProp = props["Title"];
  let title = "";
  if (titleProp && titleProp.type === "title") {
    title = titleProp.title.map((rt) => rt.plain_text).join("");
  }

  // --- Category ---
  // Category 필드는 'select' 타입: SelectSimplePropertyValueResponse
  const categoryProp = props["Category"];
  let category: string | null = null;
  if (categoryProp && categoryProp.type === "select" && categoryProp.select) {
    category = categoryProp.select.name;
  }

  // --- Tags ---
  // Tags 필드는 'multi_select' 타입: MultiSelectSimplePropertyValueResponse
  const tagsProp = props["Tags"];
  let tags: string[] = [];
  if (tagsProp && tagsProp.type === "multi_select") {
    tags = tagsProp.multi_select.map((t) => t.name);
  }

  // --- Published ---
  // Published 필드는 'date' 타입: DateSimplePropertyValueResponse
  const publishedProp = props["Published"];
  let publishedAt: string | null = null;
  if (publishedProp && publishedProp.type === "date" && publishedProp.date) {
    publishedAt = publishedProp.date.start;
  }

  // --- Status ---
  // Status 필드는 'select' 타입
  const statusProp = props["Status"];
  let status = "";
  if (statusProp && statusProp.type === "select" && statusProp.select) {
    status = statusProp.select.name;
  }

  return {
    id: page.id,
    title,
    category,
    tags,
    publishedAt,
    status,
  };
}

// ---------------------------------------------------------------------------
// 공개 API 함수
// ---------------------------------------------------------------------------

/**
 * Notion 데이터베이스(dataSources)에서 발행된 글 목록을 가져온다.
 * - Status = '발행됨' 필터 적용
 * - Published 내림차순 정렬
 *
 * @notionhq/client v5에서 databases.query가 제거되어 dataSources.query 사용.
 */
export async function fetchPages(): Promise<Post[]> {
  const response = await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: {
      property: "Status",
      type: "select",
      select: {
        equals: "발행됨",
      },
    },
    sorts: [
      {
        property: "Published",
        direction: "descending",
      },
    ],
  });

  // isFullPage로 타입 가드: PartialPageObjectResponse 및 DataSource 응답 제외
  const posts = response.results
    .filter(isFullPage)
    .map((page) => pageToPost(page as PageObjectResponse));

  return posts;
}

/**
 * 특정 Notion 페이지의 블록 콘텐츠를 모두 가져온다.
 * - 페이지네이션(has_more) 처리: 100개 이상의 블록도 완전히 수집
 * - 지원 블록 타입만 필터링하여 반환
 */
export async function fetchPageContent(pageId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined = undefined;

  // 렌더러가 지원하는 블록 type 집합
  const supportedTypes = new Set([
    "paragraph",
    "heading_1",
    "heading_2",
    "heading_3",
    "code",
    "image",
    "quote",
    "numbered_list_item",
    "bulleted_list_item",
    "divider",
  ]);

  // 페이지네이션 루프: has_more가 false가 될 때까지 반복
  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });

    for (const block of response.results) {
      // isFullBlock으로 PartialBlockObjectResponse 제외
      if (isFullBlock(block) && supportedTypes.has(block.type)) {
        blocks.push(block as NotionBlock);
      }
    }

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return blocks;
}

/**
 * 발행된 글들에서 카테고리 목록을 동적으로 추출한다.
 * - null인 카테고리 제거 및 중복 제거 후 알파벳순 정렬
 */
export async function fetchCategories(): Promise<Category[]> {
  const posts = await fetchPages();

  const categorySet = new Set<string>();
  for (const post of posts) {
    if (post.category) {
      categorySet.add(post.category);
    }
  }

  return Array.from(categorySet).sort();
}
