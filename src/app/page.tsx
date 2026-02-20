import Link from "next/link";
import { ArrowRight, Zap, Layers, Palette, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Zap,
    title: "Next.js 15",
    description: "App Router, Server Components, Streaming 등 최신 기능을 기본 탑재.",
  },
  {
    icon: Palette,
    title: "shadcn/ui",
    description: "복사해서 사용하는 아름다운 컴포넌트 라이브러리. 완전한 커스터마이징 가능.",
  },
  {
    icon: Layers,
    title: "Tailwind CSS v4",
    description: "유틸리티 우선 CSS 프레임워크로 빠르고 일관된 스타일링.",
  },
  {
    icon: Code2,
    title: "TypeScript",
    description: "타입 안전성으로 버그를 줄이고 개발 생산성을 높이세요.",
  },
];

const techStack = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui",
  "next-themes",
  "lucide-react",
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="flex flex-col items-center justify-center gap-6 py-24 px-4 text-center">
        <Badge variant="secondary" className="text-sm">
          Next.js 15 + shadcn/ui Starter Kit
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
          빠르게 시작하는{" "}
          <span className="text-primary">Next.js</span> 프로젝트
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Next.js 15, Tailwind CSS, shadcn/ui가 이미 설정된 스타터 킷입니다.
          복잡한 초기 설정 없이 바로 개발을 시작하세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard">
              대시보드 보기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/components">컴포넌트 살펴보기</Link>
          </Button>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">주요 기능</h2>
            <p className="text-muted-foreground">프로덕션 수준의 스타터 킷에 필요한 모든 것</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 기술 스택 섹션 */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">기술 스택</h2>
          <p className="text-muted-foreground mb-8">이미 설치되고 설정된 패키지 목록</p>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <Badge key={tech} variant="outline" className="text-sm px-4 py-1.5">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">지금 바로 시작하세요</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            이 스타터 킷을 클론하고 즉시 개발을 시작하세요.
            초기 설정에 시간을 낭비하지 마세요.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/dashboard">
              시작하기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
