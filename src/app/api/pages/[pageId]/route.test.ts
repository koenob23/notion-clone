import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { GET, DELETE, PATCH } from "./route";

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    page: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("Page API", () => {
  const mockUserId = "user_123";
  const mockPageId = "page_123";
  const mockPage = {
    id: mockPageId,
    title: "Test Page",
    content: "Test Content",
    userId: mockUserId,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    versions: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });
  });

  describe("GET", () => {
    it("should return unauthorized if no user ID", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });
      const response = await GET(new Request("http://localhost/api/pages/page_123"), {
        params: { pageId: mockPageId },
      });
      expect(response.status).toBe(401);
    });

    it("should return page if found", async () => {
      (prisma.page.findUnique as jest.Mock).mockResolvedValue(mockPage);
      const response = await GET(new Request("http://localhost/api/pages/page_123"), {
        params: { pageId: mockPageId },
      });
      const data = await response.json();
      expect(data).toEqual(mockPage);
    });

    it("should return 404 if page not found", async () => {
      (prisma.page.findUnique as jest.Mock).mockResolvedValue(null);
      const response = await GET(new Request("http://localhost/api/pages/page_123"), {
        params: { pageId: mockPageId },
      });
      expect(response.status).toBe(404);
    });
  });

  describe("DELETE", () => {
    it("should return unauthorized if no user ID", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });
      const response = await DELETE(new Request("http://localhost/api/pages/page_123"), {
        params: { pageId: mockPageId },
      });
      expect(response.status).toBe(401);
    });

    it("should soft delete page if found", async () => {
      (prisma.page.findUnique as jest.Mock).mockResolvedValue(mockPage);
      (prisma.page.update as jest.Mock).mockResolvedValue({ ...mockPage, isArchived: true });
      const response = await DELETE(new Request("http://localhost/api/pages/page_123"), {
        params: { pageId: mockPageId },
      });
      expect(response.status).toBe(204);
      expect(prisma.page.update).toHaveBeenCalledWith({
        where: { id: mockPageId },
        data: { isArchived: true },
      });
    });

    it("should return 404 if page not found", async () => {
      (prisma.page.findUnique as jest.Mock).mockResolvedValue(null);
      const response = await DELETE(new Request("http://localhost/api/pages/page_123"), {
        params: { pageId: mockPageId },
      });
      expect(response.status).toBe(404);
    });
  });

  describe("PATCH", () => {
    it("should return unauthorized if no user ID", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });
      const response = await PATCH(new Request("http://localhost/api/pages/page_123", {
        method: "PATCH",
        body: JSON.stringify({ content: "Updated Content" }),
      }), {
        params: { pageId: mockPageId },
      });
      expect(response.status).toBe(401);
    });

    it("should update page if found", async () => {
      const updatedPage = { ...mockPage, content: "Updated Content" };
      (prisma.page.findUnique as jest.Mock).mockResolvedValue(mockPage);
      (prisma.page.update as jest.Mock).mockResolvedValue(updatedPage);
      const response = await PATCH(new Request("http://localhost/api/pages/page_123", {
        method: "PATCH",
        body: JSON.stringify({ content: "Updated Content" }),
      }), {
        params: { pageId: mockPageId },
      });
      const data = await response.json();
      expect(data).toEqual(updatedPage);
    });

    it("should return 404 if page not found", async () => {
      (prisma.page.findUnique as jest.Mock).mockResolvedValue(null);
      const response = await PATCH(new Request("http://localhost/api/pages/page_123", {
        method: "PATCH",
        body: JSON.stringify({ content: "Updated Content" }),
      }), {
        params: { pageId: mockPageId },
      });
      expect(response.status).toBe(404);
    });
  });
}); 