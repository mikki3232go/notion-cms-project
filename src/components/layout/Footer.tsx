import Link from "next/link";
import { Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 브랜드 */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <Zap className="h-4 w-4 text-primary" />
              <span>Next Starter</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Next.js 15 + shadcn/ui로 만든 스타터 킷입니다.
              빠르게 프로젝트를 시작하세요.
            </p>
          </div>

          {/* 링크 */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">페이지</p>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                홈
              </Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                대시보드
              </Link>
              <Link href="/components" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                컴포넌트
              </Link>
            </nav>
          </div>

          {/* 기술 스택 */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">기술 스택</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>Next.js 15</li>
              <li>React 19</li>
              <li>Tailwind CSS v4</li>
              <li>shadcn/ui</li>
              <li>TypeScript</li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Next Starter Kit. MIT License.
        </p>
      </div>
    </footer>
  );
}
