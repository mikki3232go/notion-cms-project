// 글 목록에서 사용하는 카드 컴포넌트
// shadcn/ui Card를 기반으로 제목, 카테고리, 태그, 발행일을 표시한다.

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
}

/**
 * 발행일(ISO 8601)을 "YYYY년 MM월 DD일" 형식으로 변환한다.
 * publishedAt이 null이면 빈 문자열을 반환한다.
 */
function formatDate(publishedAt: string | null): string {
  if (!publishedAt) return "";
  const date = new Date(publishedAt);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** 최대 노출 태그 수 — 초과 시 "+N" 표시 */
const MAX_VISIBLE_TAGS = 3;

export function PostCard({ post }: PostCardProps) {
  const visibleTags = post.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = post.tags.length - MAX_VISIBLE_TAGS;
  const formattedDate = formatDate(post.publishedAt);

  return (
    <article>
      <Link href={`/posts/${post.id}`} className="block h-full group">
        <Card className="h-full transition-shadow hover:shadow-md hover:border-border/80 flex flex-col">
          <CardHeader className="pb-3">
            {/* 카테고리 */}
            {post.category && (
              <div className="mb-2">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              </div>
            )}

            {/* 제목 */}
            <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-3 flex-1 justify-end">
            {/* 태그 목록 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {visibleTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {/* 초과 태그 수 표시 */}
                {hiddenTagCount > 0 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{hiddenTagCount}
                  </Badge>
                )}
              </div>
            )}

            {/* 발행일 */}
            {formattedDate && (
              <time
                dateTime={post.publishedAt ?? ""}
                className="text-xs text-muted-foreground"
              >
                {formattedDate}
              </time>
            )}
          </CardContent>
        </Card>
      </Link>
    </article>
  );
}
