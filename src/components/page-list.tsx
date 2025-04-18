"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { prisma } from "@/lib/prisma"
import { PageCard } from "@/components/page-card"
import { CreatePageButton } from "@/components/create-page-button"

interface Page {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const PageList = () => {
  const { userId } = useAuth();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch('/api/pages');
        if (!response.ok) throw new Error('Failed to fetch pages');
        const data = await response.json();
        setPages(data);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Your Pages</h2>
        <CreatePageButton />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <PageCard key={page.id} page={page} />
        ))}
      </div>
    </div>
  )
} 