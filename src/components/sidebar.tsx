"use client"

import { UserButton } from "@clerk/nextjs"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageList } from "@/components/page-list"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useState, ChangeEvent } from "react"

export function Sidebar() {
  const [search, setSearch] = useState("")

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <UserButton afterSignOutUrl="/" />
        <div className="ml-4 flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pages..."
              className="h-8 pl-8"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Pages</h2>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Link href="/pages/new">
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <PageList />
        </div>
      </div>
    </div>
  )
} 