import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
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
        isArchived: true,
      },
    });

    if (!page) {
      return new NextResponse("Archived page not found", { status: 404 });
    }

    const restoredPage = await prisma.page.update({
      where: {
        id: params.pageId,
      },
      data: {
        isArchived: false,
      },
    });

    return NextResponse.json(restoredPage);
  } catch (error) {
    console.error("[PAGES_RESTORE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 