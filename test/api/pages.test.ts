import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/pages/route';
import { DELETE, PATCH } from '@/app/api/pages/[pageId]/route';
import { POST as restoreVersion } from '@/app/api/pages/[pageId]/versions/[versionId]/restore/route';
import { prismaMock } from '../setup';

describe('Pages API', () => {
  const mockRequest = (body?: any, method = 'GET', params = {}) => {
    const url = new URL('http://localhost:3000/api/pages');
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value as string);
    });
    
    return new NextRequest(url, {
      method: body ? method : 'GET',
      ...(body && { body: JSON.stringify(body) }),
    });
  };

  const mockPage = {
    id: 'test_id',
    title: 'Test Page',
    content: 'Test Content',
    userId: 'test_user',
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('POST /api/pages', () => {
    it('should create a new page', async () => {
      prismaMock.page.create.mockResolvedValue(mockPage);

      const response = await POST(mockRequest({
        title: 'Test Page',
        content: 'Test Content',
      }, 'POST'));

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(mockPage);
    });

    it('should return 400 if title is missing', async () => {
      const response = await POST(mockRequest({
        content: 'Test Content',
      }, 'POST'));

      expect(response.status).toBe(400);
    });

    it('should return 401 if not authenticated', async () => {
      jest.spyOn(require('@clerk/nextjs/server'), 'auth')
        .mockImplementationOnce(() => Promise.resolve({ userId: null }));

      const response = await POST(mockRequest({
        title: 'Test Page',
        content: 'Test Content',
      }, 'POST'));

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/pages', () => {
    it('should return pages list with pagination', async () => {
      const mockPages = [mockPage];
      prismaMock.page.findMany.mockResolvedValue(mockPages);
      prismaMock.page.count.mockResolvedValue(1);

      const response = await GET(mockRequest(null, 'GET', {
        page: '1',
        limit: '10',
      }));

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.pages).toEqual(mockPages);
      expect(data.total).toBe(1);
      expect(data.currentPage).toBe(1);
    });

    it('should filter archived pages', async () => {
      const mockPages = [{ ...mockPage, isArchived: true }];
      prismaMock.page.findMany.mockResolvedValue(mockPages);
      prismaMock.page.count.mockResolvedValue(1);

      const response = await GET(mockRequest(null, 'GET', {
        archived: 'true',
      }));

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.pages[0].isArchived).toBe(true);
    });

    it('should search pages', async () => {
      const mockPages = [mockPage];
      prismaMock.page.findMany.mockResolvedValue(mockPages);
      prismaMock.page.count.mockResolvedValue(1);

      const response = await GET(mockRequest(null, 'GET', {
        search: 'test',
      }));

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.pages).toEqual(mockPages);
    });
  });

  describe('PATCH /api/pages/[pageId]', () => {
    const mockParams = { params: { pageId: 'test_id' } };

    it('should update a page', async () => {
      prismaMock.page.findUnique.mockResolvedValue(mockPage);
      prismaMock.pageVersion.create.mockResolvedValue({ ...mockPage, id: 'version_id' });
      prismaMock.page.update.mockResolvedValue({ ...mockPage, title: 'Updated Title' });

      const response = await PATCH(
        mockRequest({ title: 'Updated Title' }, 'PATCH'),
        mockParams
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.title).toBe('Updated Title');
    });

    it('should return 404 if page not found', async () => {
      prismaMock.page.findUnique.mockResolvedValue(null);

      const response = await PATCH(
        mockRequest({ title: 'Updated Title' }, 'PATCH'),
        mockParams
      );

      expect(response.status).toBe(404);
    });
  });

  describe('Version Restore', () => {
    const mockParams = { params: { pageId: 'test_id', versionId: 'version_id' } };

    it('should restore a version', async () => {
      const mockVersion = {
        id: 'version_id',
        title: 'Old Title',
        content: 'Old Content',
        pageId: 'test_id',
        createdAt: new Date(),
      };

      prismaMock.page.findUnique.mockResolvedValue(mockPage);
      prismaMock.pageVersion.findUnique.mockResolvedValue(mockVersion);
      prismaMock.pageVersion.create.mockResolvedValue({ ...mockPage, id: 'new_version_id' });
      prismaMock.page.update.mockResolvedValue({ ...mockPage, title: 'Old Title' });

      const response = await restoreVersion(
        mockRequest(null, 'POST'),
        mockParams
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.title).toBe('Old Title');
    });
  });
}); 