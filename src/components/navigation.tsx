import * as React from "react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavigationProps {
  onMenuClick?: () => void
}

export function Navigation({ onMenuClick }: NavigationProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <nav className="flex h-14 items-center px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-4 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Notion Clone</span>
          </Link>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>
    </header>
  )
} 