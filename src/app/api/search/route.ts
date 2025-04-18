import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { searchSchema } from "@/lib/validations"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { success } = await rateLimit()
    if (!success) {
      return new NextResponse("Too Many Requests", { status: 429 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query")
    const type = searchParams.get("type") ?? "pages"

    const validatedParams = searchSchema.parse({ query, type })

    if (validatedParams.type === "pages") {
      const pages = await prisma.page.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: validatedParams.query } },
            { content: { contains: validatedParams.query } },
          ],
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      })
      return NextResponse.json(pages)
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        title: { contains: validatedParams.query },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("[SEARCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 