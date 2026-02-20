import { Metadata } from "next";
import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "대시보드",
};

const stats = [
  {
    title: "총 수익",
    value: "₩45,231,890",
    change: "+20.1%",
    isPositive: true,
    icon: DollarSign,
    description: "지난 달 대비",
  },
  {
    title: "활성 사용자",
    value: "2,350",
    change: "+180",
    isPositive: true,
    icon: Users,
    description: "이번 달 신규",
  },
  {
    title: "총 주문",
    value: "12,234",
    change: "+19%",
    isPositive: true,
    icon: ShoppingCart,
    description: "지난 달 대비",
  },
  {
    title: "성장률",
    value: "573",
    change: "-201",
    isPositive: false,
    icon: TrendingUp,
    description: "지난 달 대비",
  },
];

const recentOrders = [
  { id: "ORD-001", customer: "김민준", status: "완료", amount: "₩125,000", avatar: "김민" },
  { id: "ORD-002", customer: "이서연", status: "처리중", amount: "₩89,000", avatar: "이서" },
  { id: "ORD-003", customer: "박지호", status: "배송중", amount: "₩234,000", avatar: "박지" },
  { id: "ORD-004", customer: "최수아", status: "완료", amount: "₩56,000", avatar: "최수" },
  { id: "ORD-005", customer: "정도윤", status: "취소", amount: "₩178,000", avatar: "정도" },
];

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  완료: "default",
  처리중: "secondary",
  배송중: "outline",
  취소: "destructive",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground mt-1">비즈니스 현황을 한눈에 확인하세요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs font-medium ${
                    stat.isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 최근 주문 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>최근 주문</CardTitle>
            <CardDescription>이번 달 총 {recentOrders.length}건의 주문</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">{order.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariant[order.status] ?? "outline"}>
                      {order.status}
                    </Badge>
                    <span className="text-sm font-medium">{order.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 빠른 통계 */}
        <Card>
          <CardHeader>
            <CardTitle>이번 주 요약</CardTitle>
            <CardDescription>주요 지표 현황</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "신규 가입자", value: "48명" },
              { label: "완료된 주문", value: "132건" },
              { label: "평균 주문액", value: "₩87,400" },
              { label: "반품 요청", value: "3건" },
              { label: "고객 만족도", value: "4.8 / 5.0" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
