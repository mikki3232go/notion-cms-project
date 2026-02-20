import { Metadata } from "next";
import { Bell, Settings, ChevronDown, User, LogOut, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "컴포넌트",
};

export default function ComponentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">컴포넌트 쇼케이스</h1>
        <p className="text-muted-foreground mt-1">shadcn/ui 컴포넌트 예제 모음</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 버튼 */}
        <Card>
          <CardHeader>
            <CardTitle>Button</CardTitle>
            <CardDescription>다양한 버튼 스타일</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>기본</Button>
            <Button variant="secondary">보조</Button>
            <Button variant="outline">외곽선</Button>
            <Button variant="ghost">고스트</Button>
            <Button variant="destructive">삭제</Button>
            <Button variant="link">링크</Button>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            <Button size="sm">작게</Button>
            <Button size="default">기본</Button>
            <Button size="lg">크게</Button>
            <Button size="icon" variant="outline">
              <Bell className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* 뱃지 */}
        <Card>
          <CardHeader>
            <CardTitle>Badge</CardTitle>
            <CardDescription>상태 표시 뱃지</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 items-center">
            <Badge>기본</Badge>
            <Badge variant="secondary">보조</Badge>
            <Badge variant="outline">외곽선</Badge>
            <Badge variant="destructive">삭제</Badge>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            <Badge variant="outline">신규</Badge>
            <Badge variant="secondary">처리중</Badge>
            <Badge>완료</Badge>
            <Badge variant="destructive">오류</Badge>
          </CardFooter>
        </Card>

        {/* 폼 입력 */}
        <Card>
          <CardHeader>
            <CardTitle>Form Input</CardTitle>
            <CardDescription>입력 폼 컴포넌트</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="example@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled">비활성화</Label>
              <Input id="disabled" disabled placeholder="비활성화된 입력" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">로그인</Button>
          </CardFooter>
        </Card>

        {/* 아바타 */}
        <Card>
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>사용자 프로필 이미지</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">SM</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>KM</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg">JP</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl">AB</AvatarFallback>
            </Avatar>
          </CardContent>
          <CardFooter>
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((letter) => (
                <Avatar key={letter} className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className="text-xs">{letter}</AvatarFallback>
                </Avatar>
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +5
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* 드롭다운 메뉴 */}
        <Card>
          <CardHeader>
            <CardTitle>Dropdown Menu</CardTitle>
            <CardDescription>컨텍스트 메뉴 예제</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  메뉴 열기 <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  프로필
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  설정
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  도움말
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* 구분선 */}
        <Card>
          <CardHeader>
            <CardTitle>Separator</CardTitle>
            <CardDescription>콘텐츠 구분선</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm">위 콘텐츠</p>
              <Separator className="my-3" />
              <p className="text-sm">아래 콘텐츠</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">좌측</span>
              <Separator orientation="vertical" className="h-6" />
              <span className="text-sm">중앙</span>
              <Separator orientation="vertical" className="h-6" />
              <span className="text-sm">우측</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
