import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import logger from "@/lib/logger";

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

export async function rateLimit(
  request: NextRequest,
  identifier = "global"
) {
  try {
    const ip = request.ip ?? "127.0.0.1";
    const { success, limit, reset, remaining } = await ratelimit.limit(
      `${identifier}_${ip}`
    );

    if (!success) {
      logger.warn(`Rate limit exceeded for ${ip}`);
      return NextResponse.json(
        {
          error: "Too many requests",
          limit,
          remaining: 0,
          reset: reset - Date.now(),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.floor((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    return response;
  } catch (error) {
    logger.error("Rate limiting error:", error);
    return NextResponse.next();
  }
} 