import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { GET, POST, DELETE, PATCH } from "./route";

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/prisma", () => ({
  prisma: {
    page: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("Pages API", () => {
  const mockUserId = "user_123";
  const mockPage = {
    id: "page_123",
    title: "Test Page",
    content: "Test Content",
    userId: mockUserId,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });
  });

  describe("GET", () => {
    it("should return unauthorized if no user ID", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });
      const response = await GET(new Request("http://localhost/api/pages"));
      expect(response.status).toBe(401);
    });

    it("should return pages for user", async () => {
      (prisma.page.findMany as jest.Mock).mockResolvedValue([mockPage]);
      const response = await GET(new Request("http://localhost/api/pages"));
      const data = await response.json();
      expect(data).toEqual([mockPage]);
    });
  });

  describe("POST", () => {
    it("should return unauthorized if no user ID", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });
      const response = await POST(new Request("http://localhost/api/pages", {
        method: "POST",
        body: JSON.stringify({ title: "Test" }),
      }));
      expect(response.status).toBe(401);
    });

    it("should create a page", async () => {
      (prisma.page.create as jest.Mock).mockResolvedValue(mockPage);
      const response = await POST(new Request("http://localhost/api/pages", {
        method: "POST",
        body: JSON.stringify({ title: "Test" }),
      }));
      const data = await response.json();
      expect(data).toEqual(mockPage);
    });
  });

  describe("DELETE", () => {
    it("should return unauthorized if no user ID", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });
      const response = await DELETE(new Request("http://localhost/api/pages?id=page_123"));
      expect(response.status).toBe(401);
    });

    it("should delete a page", async () => {
      (prisma.page.findUnique as jest.Mock).mockResolvedValue(mockPage);
      (prisma.page.delete as jest.Mock).mockResolvedValue(mockPage);
      const response = await DELETE(new Request("http://localhost/api/pages?id=page_123"));
      expect(response.status).toBe(204);
    });
  });

  describe("PATCH", () => {
    it("should return unauthorized if no user ID", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });
      const response = await PATCH(new Request("http://localhost/api/pages?id=page_123", {
        method: "PATCH",
        body: JSON.stringify({ title: "Updated" }),
      }));
      expect(response.status).toBe(401);
    });

    it("should update a page", async () => {
      const updatedPage = { ...mockPage, title: "Updated" };
      (prisma.page.findUnique as jest.Mock).mockResolvedValue(mockPage);
      (prisma.page.update as jest.Mock).mockResolvedValue(updatedPage);
      const response = await PATCH(new Request("http://localhost/api/pages?id=page_123", {
        method: "PATCH",
        body: JSON.stringify({ title: "Updated" }),
      }));
      const data = await response.json();
      expect(data).toEqual(updatedPage);
    });
  });
}); 