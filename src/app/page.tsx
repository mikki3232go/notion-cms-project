// 블로그 홈 페이지 — 발행된 글 목록을 최신순으로 표시한다.
// ISR: 1시간마다 재생성 (Notion 데이터 업데이트 주기 고려)

import { fetchPages } from "@/lib/notion";
import { PostCard } from "@/components/PostCard";

export const revalidate = 3600;

export default async function HomePage() {
  // 서버 컴포넌트에서 직접 데이터 페칭 — 발행됨 글만 반환, 발행일 내림차순
  // Notion API 자격증명이 없는 환경(빌드/로컬 개발 초기)에서는 빈 배열을 반환
  let posts: Awaited<ReturnType<typeof fetchPages>> = [];
  try {
    posts = await fetchPages();
  } catch {
    // 자격증명 오류 등 API 실패 시 빈 상태로 렌더링
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-screen-xl">
      {/* 페이지 헤더 */}
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dev Blog</h1>
        <p className="text-muted-foreground text-base">
          개발 경험과 학습 내용을 기록하는 기술 블로그입니다.
        </p>
      </section>

      {/* 글 목록 */}
      <section aria-label="블로그 글 목록">
        {posts.length === 0 ? (
          /* 글이 없을 때 빈 상태 UI */
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <p className="text-lg font-medium text-muted-foreground">
              아직 발행된 글이 없습니다.
            </p>
            <p className="text-sm text-muted-foreground">
              Notion에서 글을 작성하고 상태를 &quot;발행됨&quot;으로 변경하면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <ul
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none"
            aria-label={`전체 ${posts.length}개의 글`}
          >
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
