import { auth } from "@clerk/nextjs"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const headersList = headers()
  const response = new Response(
    new ReadableStream({
      async start(controller) {
        const send = (data: any) => {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`))
        }

        // Initial pages
        const pages = await prisma.page.findMany({
          where: { userId },
          orderBy: { updatedAt: "desc" },
        })
        send({ type: "INITIAL", pages })

        // Subscribe to changes
        const interval = setInterval(async () => {
          const updatedPages = await prisma.page.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
          })
          send({ type: "UPDATE", pages: updatedPages })
        }, 5000)

        // Cleanup
        return () => clearInterval(interval)
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    }
  )

  return response
} 