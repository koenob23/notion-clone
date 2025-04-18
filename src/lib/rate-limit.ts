import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { headers } from "next/headers"

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
})

export async function rateLimit() {
  const headersList = headers()
  const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1"

  const { success, limit, reset, remaining } = await ratelimit.limit(ip)

  return {
    success,
    limit,
    remaining,
    reset,
  }
} 