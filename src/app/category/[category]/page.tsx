// 카테고리별 글 목록 페이지
// ISR: 1시간마다 재생성

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { fetchCategories, fetchPages } from "@/lib/notion";
import { PostCard } from "@/components/PostCard";

export const revalidate = 3600;

// ---------------------------------------------------------------------------
// 타입 정의
// ---------------------------------------------------------------------------

interface PageProps {
  params: Promise<{ category: string }>;
}

// ---------------------------------------------------------------------------
// 정적 생성 — 발행된 글들의 모든 카테고리를 미리 생성
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  try {
    const categories = await fetchCategories();
    // URL에서 사용 가능한 형태로 인코딩 (한글 카테고리 대응)
    return categories.map((category) => ({
      category: encodeURIComponent(category),
    }));
  } catch {
    // Notion API 자격증명이 없는 빌드 환경에서는 빈 배열 반환 (정상)
    return [];
  }
}

// ---------------------------------------------------------------------------
// 동적 메타데이터
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  return {
    title: `${decodedCategory} 카테고리`,
    description: `${decodedCategory} 카테고리의 글 목록`,
  };
}

// ---------------------------------------------------------------------------
// 페이지 컴포넌트
// ---------------------------------------------------------------------------

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  // URL 인코딩된 카테고리명을 디코딩 (한글 카테고리 대응)
  const decodedCategory = decodeURIComponent(category);

  let filteredPosts: Awaited<ReturnType<typeof fetchPages>> = [];

  try {
    const allPosts = await fetchPages();
    filteredPosts = allPosts.filter((post) => post.category === decodedCategory);
  } catch {
    notFound();
  }

  // 존재하지 않는 카테고리이거나 발행된 글이 없으면 404
  if (filteredPosts.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-screen-xl">
      {/* 카테고리 헤더 */}
      <section className="mb-10">
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">{decodedCategory}</h1>
          {/* 글 개수 표시 */}
          <span className="text-lg text-muted-foreground font-medium">
            {filteredPosts.length}개의 글
          </span>
        </div>
        {/* 홈으로 돌아가기 링크 */}
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 전체 글 목록으로
        </Link>
      </section>

      {/* 글 목록 */}
      <section aria-label={`${decodedCategory} 카테고리 글 목록`}>
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none"
          aria-label={`${decodedCategory} 카테고리 ${filteredPosts.length}개의 글`}
        >
          {filteredPosts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
