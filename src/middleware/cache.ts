import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import logger from "@/lib/logger";

const redis = Redis.fromEnv();
const DEFAULT_TTL = 3600; // 1 hour

export async function cache(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  options: {
    ttl?: number;
    tags?: string[];
    bypass?: boolean;
  } = {}
) {
  const { ttl = DEFAULT_TTL, tags = [], bypass = false } = options;

  // Don't cache non-GET requests
  if (request.method !== "GET" || bypass) {
    return handler();
  }

  const cacheKey = `cache:${request.url}`;

  try {
    // Try to get from cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for ${request.url}`);
      return NextResponse.json(JSON.parse(cached as string), {
        headers: { "X-Cache": "HIT" },
      });
    }

    // Get fresh data
    const response = await handler();
    const data = await response.json();

    // Cache the response
    await redis.set(cacheKey, JSON.stringify(data), {
      ex: ttl,
    });

    // Store cache tags for invalidation
    if (tags.length > 0) {
      await Promise.all(
        tags.map((tag) =>
          redis.sadd(`cachetag:${tag}`, cacheKey)
        )
      );
    }

    logger.debug(`Cache miss for ${request.url}`);
    return NextResponse.json(data, {
      headers: { "X-Cache": "MISS" },
    });
  } catch (error) {
    logger.error("Cache error:", error);
    return handler();
  }
}

export async function invalidateCache(tags: string[]) {
  try {
    // Get all cache keys for the given tags
    const cacheKeys = await Promise.all(
      tags.map((tag) => redis.smembers(`cachetag:${tag}`))
    );

    // Flatten and dedupe keys
    const uniqueKeys = [...new Set(cacheKeys.flat())];

    // Delete all cached data and tag sets
    await Promise.all([
      ...uniqueKeys.map((key) => redis.del(key)),
      ...tags.map((tag) => redis.del(`cachetag:${tag}`)),
    ]);

    logger.info(`Cache invalidated for tags: ${tags.join(", ")}`);
  } catch (error) {
    logger.error("Cache invalidation error:", error);
  }
} 