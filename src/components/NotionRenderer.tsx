// Notion 블록을 HTML 요소로 렌더링하는 서버 컴포넌트
// 지원 블록: paragraph, heading_1~3, code, image, quote,
//             numbered_list_item, bulleted_list_item, divider

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NotionBlock, RichTextItemResponse } from "@/types/notion";

// ---------------------------------------------------------------------------
// Rich Text 렌더링
// ---------------------------------------------------------------------------

/**
 * 단일 RichTextItemResponse를 적절한 인라인 HTML 요소로 변환한다.
 * annotations(bold, italic, code, strikethrough)를 중첩 적용한다.
 */
function RichTextNode({ item }: { item: RichTextItemResponse }) {
  const { annotations, plain_text } = item;

  // 링크가 있는 경우 href 추출 (TextRichTextItemResponse에만 존재)
  const href =
    item.type === "text" && item.text.link ? item.text.link.url : null;

  // 텍스트 콘텐츠에 annotation 순서대로 래핑
  let node: React.ReactNode = plain_text;

  if (annotations.code) {
    node = (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
        {node}
      </code>
    );
  }
  if (annotations.bold) {
    node = <strong>{node}</strong>;
  }
  if (annotations.italic) {
    node = <em>{node}</em>;
  }
  if (annotations.strikethrough) {
    node = <del>{node}</del>;
  }
  if (annotations.underline) {
    node = <span className="underline">{node}</span>;
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
      >
        {node}
      </a>
    );
  }

  return <>{node}</>;
}

/**
 * RichTextItemResponse 배열 전체를 렌더링한다.
 * 배열이 비어 있으면 빈 Fragment를 반환한다.
 */
function RichTextContent({ items }: { items: RichTextItemResponse[] }) {
  if (items.length === 0) return null;
  return (
    <>
      {items.map((item, index) => (
        // plain_text가 같아도 순서가 중요하므로 index를 key에 포함
        <RichTextNode key={`${item.plain_text}-${index}`} item={item} />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// 개별 블록 컴포넌트
// ---------------------------------------------------------------------------

/** paragraph 블록 */
function ParagraphBlock({
  block,
}: {
  block: Extract<NotionBlock, { type: "paragraph" }>;
}) {
  return (
    <p className="leading-7 text-foreground">
      <RichTextContent items={block.paragraph.rich_text} />
    </p>
  );
}

/** heading_1 블록 */
function Heading1Block({
  block,
}: {
  block: Extract<NotionBlock, { type: "heading_1" }>;
}) {
  return (
    <h1 className="mt-8 mb-4 text-2xl font-bold tracking-tight">
      <RichTextContent items={block.heading_1.rich_text} />
    </h1>
  );
}

/** heading_2 블록 */
function Heading2Block({
  block,
}: {
  block: Extract<NotionBlock, { type: "heading_2" }>;
}) {
  return (
    <h2 className="mt-6 mb-3 text-xl font-semibold tracking-tight">
      <RichTextContent items={block.heading_2.rich_text} />
    </h2>
  );
}

/** heading_3 블록 */
function Heading3Block({
  block,
}: {
  block: Extract<NotionBlock, { type: "heading_3" }>;
}) {
  return (
    <h3 className="mt-5 mb-2 text-lg font-semibold">
      <RichTextContent items={block.heading_3.rich_text} />
    </h3>
  );
}

/** code 블록 — 언어 Badge + 코드 내용 */
function CodeBlock({
  block,
}: {
  block: Extract<NotionBlock, { type: "code" }>;
}) {
  const { rich_text, language } = block.code;
  const codeText = rich_text.map((rt) => rt.plain_text).join("");

  return (
    <div className="my-4">
      {/* 언어 레이블 */}
      <div className="flex items-center gap-2 mb-0">
        <Badge variant="secondary" className="text-xs rounded-b-none rounded-t-md px-2 py-0.5">
          {language}
        </Badge>
      </div>
      <pre className="bg-muted rounded-md rounded-tl-none p-4 overflow-x-auto">
        <code className="text-sm font-mono">{codeText}</code>
      </pre>
    </div>
  );
}

/** image 블록 — Next.js Image 컴포넌트, alt 필수 적용 */
function ImageBlock({
  block,
}: {
  block: Extract<NotionBlock, { type: "image" }>;
}) {
  const { image } = block;

  // external / file(내부 업로드) 두 가지 경우 처리
  const src =
    image.type === "external" ? image.external.url : image.file.url;

  // caption이 있으면 alt로, 없으면 "블로그 이미지"를 기본값으로 사용
  const captionText = image.caption.map((rt) => rt.plain_text).join("") || "블로그 이미지";

  return (
    <figure className="my-6">
      {/* 이미지 크기를 알 수 없으므로 상대 컨테이너 + fill 사용 */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <Image
          src={src}
          alt={captionText}
          fill
          className="object-contain rounded-md"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 768px, 672px"
        />
      </div>
      {/* caption이 있을 때만 figcaption 표시 */}
      {image.caption.length > 0 && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          <RichTextContent items={image.caption} />
        </figcaption>
      )}
    </figure>
  );
}

/** quote 블록 — 좌측 border 스타일 */
function QuoteBlock({
  block,
}: {
  block: Extract<NotionBlock, { type: "quote" }>;
}) {
  return (
    <blockquote className="border-l-4 border-primary/40 pl-4 py-1 my-4 text-muted-foreground italic">
      <RichTextContent items={block.quote.rich_text} />
    </blockquote>
  );
}

/** numbered_list_item 블록 */
function NumberedListItemBlock({
  block,
}: {
  block: Extract<NotionBlock, { type: "numbered_list_item" }>;
}) {
  return (
    <li className="ml-6 list-decimal leading-7">
      <RichTextContent items={block.numbered_list_item.rich_text} />
    </li>
  );
}

/** bulleted_list_item 블록 */
function BulletedListItemBlock({
  block,
}: {
  block: Extract<NotionBlock, { type: "bulleted_list_item" }>;
}) {
  return (
    <li className="ml-6 list-disc leading-7">
      <RichTextContent items={block.bulleted_list_item.rich_text} />
    </li>
  );
}

/** divider 블록 */
function DividerBlock() {
  return <hr className="my-6 border-border" />;
}

// ---------------------------------------------------------------------------
// 목록 블록 그룹핑 헬퍼
// ---------------------------------------------------------------------------

type GroupedBlock =
  | { kind: "single"; block: NotionBlock }
  | { kind: "numbered_list"; blocks: Extract<NotionBlock, { type: "numbered_list_item" }>[] }
  | { kind: "bulleted_list"; blocks: Extract<NotionBlock, { type: "bulleted_list_item" }>[] };

/**
 * 연속된 numbered_list_item / bulleted_list_item을 하나의 ol/ul로 그룹핑한다.
 * 그룹핑하지 않으면 각 li가 독립된 목록으로 렌더링되어 스타일이 깨진다.
 */
function groupBlocks(blocks: NotionBlock[]): GroupedBlock[] {
  const result: GroupedBlock[] = [];

  for (const block of blocks) {
    if (block.type === "numbered_list_item") {
      const last = result[result.length - 1];
      if (last && last.kind === "numbered_list") {
        last.blocks.push(block as Extract<NotionBlock, { type: "numbered_list_item" }>);
      } else {
        result.push({
          kind: "numbered_list",
          blocks: [block as Extract<NotionBlock, { type: "numbered_list_item" }>],
        });
      }
    } else if (block.type === "bulleted_list_item") {
      const last = result[result.length - 1];
      if (last && last.kind === "bulleted_list") {
        last.blocks.push(block as Extract<NotionBlock, { type: "bulleted_list_item" }>);
      } else {
        result.push({
          kind: "bulleted_list",
          blocks: [block as Extract<NotionBlock, { type: "bulleted_list_item" }>],
        });
      }
    } else {
      result.push({ kind: "single", block });
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// 단일 블록 렌더러 (타입 switch)
// ---------------------------------------------------------------------------

function BlockRenderer({ block }: { block: NotionBlock }) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock block={block} />;
    case "heading_1":
      return <Heading1Block block={block} />;
    case "heading_2":
      return <Heading2Block block={block} />;
    case "heading_3":
      return <Heading3Block block={block} />;
    case "code":
      return <CodeBlock block={block} />;
    case "image":
      return <ImageBlock block={block} />;
    case "quote":
      return <QuoteBlock block={block} />;
    case "divider":
      return <DividerBlock />;
    // numbered_list_item / bulleted_list_item은 groupBlocks에서 처리되므로 여기에는 도달하지 않음
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// 메인 렌더러 컴포넌트
// ---------------------------------------------------------------------------

interface NotionRendererProps {
  blocks: NotionBlock[];
}

/**
 * Notion 블록 배열을 받아 HTML로 렌더링하는 서버 컴포넌트.
 * 연속된 목록 항목은 자동으로 그룹핑하여 ol/ul로 감싼다.
 */
export function NotionRenderer({ blocks }: NotionRendererProps) {
  const grouped = groupBlocks(blocks);

  return (
    <div className={cn("space-y-4 text-base")}>
      {grouped.map((group, index) => {
        if (group.kind === "numbered_list") {
          return (
            <ol key={index} className="space-y-1 my-2">
              {group.blocks.map((block) => (
                <NumberedListItemBlock key={block.id} block={block} />
              ))}
            </ol>
          );
        }

        if (group.kind === "bulleted_list") {
          return (
            <ul key={index} className="space-y-1 my-2">
              {group.blocks.map((block) => (
                <BulletedListItemBlock key={block.id} block={block} />
              ))}
            </ul>
          );
        }

        // 단일 블록
        return <BlockRenderer key={group.block.id} block={group.block} />;
      })}
    </div>
  );
}
