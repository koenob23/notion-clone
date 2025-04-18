import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      include: {
        versions: {
          orderBy: {
            createdAt: "desc"
          },
          take: 10
        }
      }
    });

    if (!page) {
      return new NextResponse("Page not found", { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("[PAGES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
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

    // Soft delete
    await prisma.page.update({
      where: {
        id: params.pageId,
      },
      data: {
        isArchived: true,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PAGES_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { pageId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content } = await req.json();

    const page = await prisma.page.findUnique({
      where: {
        id: params.pageId,
        userId,
      },
    });

    if (!page) {
      return new NextResponse("Not found", { status: 404 });
    }

    const updatedPage = await prisma.page.update({
      where: {
        id: params.pageId,
      },
      data: {
        content,
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("[PAGE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 