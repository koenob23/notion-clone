"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageEditor } from "@/components/page-editor";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@clerk/nextjs";
import type { Page } from "@prisma/client";

interface PageProps {
  params: {
    pageId: string;
  };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/pages/${params.pageId}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push("/");
            return;
          }
          throw new Error("Failed to fetch page");
        }
        const data = await response.json();
        setPage(data);
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [userId, params.pageId, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!page) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <PageEditor
          initialContent={page.content || ""}
          pageId={page.id}
          onSave={() => {
            const refreshPage = async () => {
              try {
                const response = await fetch(`/api/pages/${params.pageId}`);
                if (!response.ok) {
                  throw new Error("Failed to fetch page");
                }
                const data = await response.json();
                setPage(data);
              } catch (error) {
                console.error("Error refreshing page:", error);
              }
            };
            refreshPage();
          }}
        />
      </div>
    </div>
  );
} 