"use client";

// 방문자 수 표시 클라이언트 컴포넌트
// 마운트 시 /api/visitors POST 호출 → 카운트 증가 후 화면에 표시

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/visitors", { method: "POST" })
      .then((res) => res.json())
      .then((data: { count: number }) => setCount(data.count))
      .catch(() => {
        // API 호출 실패 시 카운트를 표시하지 않음
      });
  }, []);

  return (
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Eye className="w-4 h-4" aria-hidden="true" />
      <span>{count !== null ? count.toLocaleString() : "--"}</span>
    </span>
  );
}
