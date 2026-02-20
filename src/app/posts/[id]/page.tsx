// 글 상세 페이지 — Notion 페이지 블록을 렌더링한다.
// ISR: 1시간마다 재생성

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { fetchPageContent, fetchPages } from "@/lib/notion";
import { NotionRenderer } from "@/components/NotionRenderer";
import type { Post } from "@/types/post";

export const revalidate = 3600;

// ---------------------------------------------------------------------------
// 타입 정의
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ id: string }>;
}

// ---------------------------------------------------------------------------
// 정적 생성 — 발행된 모든 글의 [id] 파라미터를 미리 생성
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  try {
    const posts = await fetchPages();
    return posts.map((post) => ({ id: post.id }));
  } catch {
    // Notion API 자격증명이 없는 빌드 환경에서는 빈 배열 반환 (정상)
    return [];
  }
}

// ---------------------------------------------------------------------------
// 동적 메타데이터 — 글 제목으로 title 생성
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const posts = await fetchPages();
    const post = posts.find((p) => p.id === id);

    if (!post) {
      return { title: "글을 찾을 수 없습니다" };
    }

    return {
      title: post.title,
      description: post.category
        ? `${post.category} 카테고리의 글`
        : "Dev Blog 글",
      openGraph: {
        title: post.title,
        type: "article",
        publishedTime: post.publishedAt ?? undefined,
        tags: post.tags,
      },
    };
  } catch {
    return { title: "글 상세" };
  }
}

// ---------------------------------------------------------------------------
// 헬퍼 함수
// ---------------------------------------------------------------------------

/** ISO 날짜 문자열 → "YYYY년 MM월 DD일" 형식으로 변환 */
function formatDate(publishedAt: string | null): string {
  if (!publishedAt) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(publishedAt));
}

// ---------------------------------------------------------------------------
// 이전/다음 글 네비게이션 컴포넌트
// ---------------------------------------------------------------------------

interface PostNavigationProps {
  prev: Post | null;
  next: Post | null;
}

function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="이전/다음 글 이동"
      className="mt-12 pt-8 border-t grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {/* 이전 글 (더 최신 글) */}
      {prev ? (
        <Link
          href={`/posts/${prev.id}`}
          className="group flex flex-col gap-1 p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-colors"
        >
          <span className="text-xs text-muted-foreground">이전 글</span>
          <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
            {prev.title}
          </span>
        </Link>
      ) : (
        // 빈 셀 — 레이아웃 유지
        <div />
      )}

      {/* 다음 글 (더 오래된 글) */}
      {next ? (
        <Link
          href={`/posts/${next.id}`}
          className="group flex flex-col gap-1 p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-colors sm:items-end text-right"
        >
          <span className="text-xs text-muted-foreground">다음 글</span>
          <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// 페이지 컴포넌트
// ---------------------------------------------------------------------------

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;

  // 전체 글 목록에서 현재 글 및 이전/다음 글 탐색
  let posts: Post[] = [];
  try {
    posts = await fetchPages();
  } catch {
    notFound();
  }

  const currentIndex = posts.findIndex((p) => p.id === id);
  if (currentIndex === -1) {
    notFound();
  }

  const currentPost = posts[currentIndex];
  // fetchPages()는 최신순 정렬이므로: 인덱스가 작을수록 최신(이전 글)
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  // 본문 블록 조회
  let blocks: Awaited<ReturnType<typeof fetchPageContent>> = [];
  try {
    blocks = await fetchPageContent(id);
  } catch {
    // 블록 조회 실패 시에도 메타 정보는 표시하고 본문은 비워둠
  }

  const formattedDate = formatDate(currentPost.publishedAt);

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* 글 헤더 */}
      <header className="mb-8">
        {/* 카테고리 */}
        {currentPost.category && (
          <div className="mb-3">
            <Link href={`/category/${encodeURIComponent(currentPost.category)}`}>
              <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
                {currentPost.category}
              </Badge>
            </Link>
          </div>
        )}

        {/* 제목 */}
        <h1 className="text-3xl font-bold tracking-tight leading-tight mb-4">
          {currentPost.title}
        </h1>

        {/* 발행일 + 태그 */}
        <div className="flex flex-wrap items-center gap-3">
          {formattedDate && (
            <time
              dateTime={currentPost.publishedAt ?? ""}
              className="text-sm text-muted-foreground"
            >
              {formattedDate}
            </time>
          )}

          {currentPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {currentPost.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 구분선 */}
      <hr className="mb-8 border-border" />

      {/* 본문 */}
      <article>
        {blocks.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            본문 내용이 없습니다.
          </p>
        ) : (
          <NotionRenderer blocks={blocks} />
        )}
      </article>

      {/* 이전/다음 글 네비게이션 */}
      <PostNavigation prev={prevPost} next={nextPost} />
    </div>
  );
}
