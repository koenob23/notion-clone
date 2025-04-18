"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PageVersion {
  id: string;
  title: string;
  content: string | null;
  createdAt: string;
}

interface PageVersionListProps {
  versions: PageVersion[];
  pageId: string;
}

export function PageVersionList({ versions, pageId }: PageVersionListProps) {
  const router = useRouter();
  const [isRestoring, setIsRestoring] = useState<string | null>(null);

  const restoreVersion = async (versionId: string) => {
    try {
      setIsRestoring(versionId);
      const response = await fetch(`/api/pages/${pageId}/versions/${versionId}/restore`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to restore version");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsRestoring(null);
    }
  };

  if (versions.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No version history yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {versions.map((version) => (
        <div
          key={version.id}
          className="p-4 bg-white rounded-lg border flex items-start justify-between"
        >
          <div className="space-y-2">
            <div>
              <h3 className="font-medium">{version.title}</h3>
              {version.content && (
                <p className="text-sm text-gray-600 line-clamp-2">{version.content}</p>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {new Date(version.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => restoreVersion(version.id)}
            disabled={isRestoring === version.id}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {isRestoring === version.id ? "Restoring..." : "Restore"}
          </button>
        </div>
      ))}
    </div>
  );
} 