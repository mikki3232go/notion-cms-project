// 방문자 수 API Route
// POST: 방문자 수 1 증가 후 최신값 반환
// GET:  현재 방문자 수 조회

import { NextResponse } from "next/server";
import redis from "@/lib/redis";

const REDIS_KEY = "blog:visitors";

export async function POST() {
  const count = await redis.incr(REDIS_KEY);
  return NextResponse.json({ count });
}

export async function GET() {
  const raw = await redis.get<number>(REDIS_KEY);
  const count = raw ?? 0;
  return NextResponse.json({ count });
}
