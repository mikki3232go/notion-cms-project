// 블로그 홈 페이지 — 발행된 글 목록을 최신순으로 표시한다.
// ISR: 1시간마다 재생성 (Notion 데이터 업데이트 주기 고려)

import { fetchPages, fetchCategories } from "@/lib/notion";
import { PostListWithFilter } from "@/components/PostListWithFilter";
import { VisitorCount } from "@/components/VisitorCount";

export const revalidate = 3600;

export default async function HomePage() {
  // 서버 컴포넌트에서 직접 데이터 페칭 — 발행됨 글만 반환, 발행일 내림차순
  // Notion API 자격증명이 없는 환경(빌드/로컬 개발 초기)에서는 빈 배열을 반환
  let posts: Awaited<ReturnType<typeof fetchPages>> = [];
  let categories: Awaited<ReturnType<typeof fetchCategories>> = [];

  try {
    // 두 요청을 병렬로 실행하여 지연 최소화
    [posts, categories] = await Promise.all([fetchPages(), fetchCategories()]);
  } catch {
    // 자격증명 오류 등 API 실패 시 빈 상태로 렌더링
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-screen-xl">
      {/* 페이지 헤더 */}
      <section className="mb-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Dev Blog</h1>
            <p className="text-muted-foreground text-base">
              개발 경험과 학습 내용을 기록하는 기술 블로그입니다.
            </p>
          </div>
          <VisitorCount />
        </div>
      </section>

      {/* 카테고리 필터 + 검색 + 글 목록 */}
      <PostListWithFilter posts={posts} categories={categories} />
    </div>
  );
}
