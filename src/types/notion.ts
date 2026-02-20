// Notion 블록 렌더링에 필요한 타입 정의
// @notionhq/client의 공식 타입을 기반으로 지원 블록만 추출하여 정의한다.

import type {
  ParagraphBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  CodeBlockObjectResponse,
  ImageBlockObjectResponse,
  QuoteBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  DividerBlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

// @notionhq/client 공식 타입을 re-export해서 다른 파일에서 직접 import하지 않아도 되도록 한다.
export type { RichTextItemResponse };

/**
 * 렌더러가 지원하는 Notion 블록 타입의 유니온.
 * 지원하지 않는 블록 타입은 렌더링 시 null을 반환한다.
 */
export type NotionBlock =
  | ParagraphBlockObjectResponse
  | Heading1BlockObjectResponse
  | Heading2BlockObjectResponse
  | Heading3BlockObjectResponse
  | CodeBlockObjectResponse
  | ImageBlockObjectResponse
  | QuoteBlockObjectResponse
  | NumberedListItemBlockObjectResponse
  | BulletedListItemBlockObjectResponse
  | DividerBlockObjectResponse;

/** 지원하는 블록 type 문자열 리터럴 유니온 */
export type SupportedBlockType = NotionBlock["type"];
