// 블로그 푸터 컴포넌트 — 브랜드 정보, 페이지 링크, 기술 스택 표시

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// 푸터에 표시할 기술 스택 목록
const techStack = [
  "Next.js 15",
  "Notion API",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui",
];

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 브랜드 */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>Dev Blog</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Notion을 CMS로 활용한 개인 기술 블로그입니다.
              개발 경험과 학습 내용을 기록합니다.
            </p>
          </div>

          {/* 페이지 링크 */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">페이지</p>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                홈
              </Link>
            </nav>
          </div>

          {/* 기술 스택 */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">기술 스택</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {techStack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Dev Blog. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
