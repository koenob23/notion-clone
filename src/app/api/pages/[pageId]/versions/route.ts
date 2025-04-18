import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { pageId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const page = await prisma.page.findUnique({
      where: {
        id: params.pageId,
        userId,
        isArchived: false,
      },
    });

    if (!page) {
      return new NextResponse("Page not found", { status: 404 });
    }

    const versions = await prisma.pageVersion.findMany({
      where: {
        pageId: params.pageId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(versions);
  } catch (error) {
    console.error("[PAGES_VERSIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 