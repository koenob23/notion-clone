import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, content } = body;

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const page = await prisma.page.create({
      data: {
        title,
        content: content || "",
        userId,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("[PAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const pages = await prisma.page.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("[PAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = new URL(req.url);
    const pageId = url.searchParams.get("id");

    if (!pageId) {
      return new NextResponse("Page ID is required", { status: 400 });
    }

    const page = await prisma.page.findUnique({
      where: {
        id: pageId,
        userId,
      },
    });

    if (!page) {
      return new NextResponse("Page not found", { status: 404 });
    }

    await prisma.page.delete({
      where: {
        id: pageId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PAGES_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = new URL(req.url);
    const pageId = url.searchParams.get("id");

    if (!pageId) {
      return new NextResponse("Page ID is required", { status: 400 });
    }

    const body = await req.json();
    const { title, content } = body;

    if (!title && !content) {
      return new NextResponse("Title or content is required", { status: 400 });
    }

    const page = await prisma.page.findUnique({
      where: {
        id: pageId,
        userId,
      },
    });

    if (!page) {
      return new NextResponse("Page not found", { status: 404 });
    }

    const updatedPage = await prisma.page.update({
      where: {
        id: pageId,
      },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("[PAGES_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 