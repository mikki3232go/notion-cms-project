"use client";

// 카테고리 필터 탭 + 검색창 + 필터링된 글 목록을 통합 관리하는 클라이언트 컴포넌트.
// 서버 컴포넌트(page.tsx)로부터 posts, categories 데이터를 props로 받는다.

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/PostCard";
import { useDebounce } from "@/hooks/useDebounce";
import type { Post, Category } from "@/types/post";

interface PostListWithFilterProps {
  posts: Post[];
  categories: Category[];
}

export function PostListWithFilter({ posts, categories }: PostListWithFilterProps) {
  // 선택된 카테고리 (null = 전체)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // 검색어 원본값 (입력과 즉시 동기화)
  const [searchQuery, setSearchQuery] = useState("");
  // 디바운스된 검색어 (실제 필터링에 사용 — 입력 300ms 후 반영)
  const debouncedQuery = useDebounce(searchQuery, 300);

  // 카테고리 + 검색어를 조합하여 필터링된 글 목록을 계산한다.
  // posts, selectedCategory, debouncedQuery 중 하나라도 바뀌면 재계산.
  const filteredPosts = useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();

    return posts.filter((post) => {
      // 카테고리 필터: 선택된 카테고리가 있으면 일치하는 글만 포함
      const matchesCategory =
        selectedCategory === null || post.category === selectedCategory;

      // 검색 필터: 제목 또는 태그 중 하나라도 검색어를 포함하면 포함
      const matchesSearch =
        query === "" ||
        post.title.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, debouncedQuery]);

  return (
    <div className="space-y-8">
      {/* 검색 입력창 */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="제목 또는 태그로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          aria-label="글 검색"
        />
      </div>

      {/* 카테고리 필터 탭 */}
      {categories.length > 0 && (
        <nav aria-label="카테고리 필터">
          <ul className="flex flex-wrap gap-2 list-none">
            {/* 전체 탭 */}
            <li>
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                aria-pressed={selectedCategory === null}
              >
                전체
              </Button>
            </li>

            {/* 카테고리별 탭 */}
            {categories.map((category) => (
              <li key={category}>
                <Button
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}
                >
                  {category}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* 필터링된 글 목록 */}
      <section aria-label="블로그 글 목록">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            {debouncedQuery || selectedCategory ? (
              /* 검색/필터 결과가 없을 때 */
              <>
                <p className="text-lg font-medium text-muted-foreground">
                  검색 결과가 없습니다.
                </p>
                <p className="text-sm text-muted-foreground">
                  다른 검색어나 카테고리를 시도해 보세요.
                </p>
              </>
            ) : (
              /* 발행된 글 자체가 없을 때 */
              <>
                <p className="text-lg font-medium text-muted-foreground">
                  아직 발행된 글이 없습니다.
                </p>
                <p className="text-sm text-muted-foreground">
                  Notion에서 글을 작성하고 상태를 &quot;발행됨&quot;으로 변경하면 여기에 표시됩니다.
                </p>
              </>
            )}
          </div>
        ) : (
          <ul
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none"
            aria-label={`${filteredPosts.length}개의 글`}
          >
            {filteredPosts.map((post) => (
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
