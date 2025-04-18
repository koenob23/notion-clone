import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { pageId: string; versionId: string } }
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

    const version = await prisma.pageVersion.findUnique({
      where: {
        id: params.versionId,
        pageId: params.pageId,
      },
    });

    if (!version) {
      return new NextResponse("Version not found", { status: 404 });
    }

    // Create version of current state before restoring
    await prisma.pageVersion.create({
      data: {
        title: page.title,
        content: page.content,
        pageId: page.id,
      },
    });

    // Restore the old version
    const restoredPage = await prisma.page.update({
      where: {
        id: params.pageId,
      },
      data: {
        title: version.title,
        content: version.content,
      },
      include: {
        versions: {
          orderBy: {
            createdAt: "desc"
          },
          take: 10
        }
      }
    });

    return NextResponse.json(restoredPage);
  } catch (error) {
    console.error("[VERSION_RESTORE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 