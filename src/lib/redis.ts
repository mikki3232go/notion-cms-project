// Upstash Redis 클라이언트 싱글톤
// 서버리스 환경(Vercel)에 최적화된 REST 기반 Redis 클라이언트

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default redis;
