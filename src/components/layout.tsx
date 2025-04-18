'use client';

import * as React from "react"
import { Navigation } from "@/components/navigation"
import { Sidebar } from "@/components/sidebar"
import { ErrorBoundary } from "@/components/error-boundary"
import { SearchCommand } from "@/components/search"
import dynamic from 'next/dynamic'

const AnalyticsProvider = dynamic(() => import('@/lib/analytics').then(mod => mod.AnalyticsProvider), {
  ssr: false
})

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <AnalyticsProvider>
      <ErrorBoundary>
        <div className="relative flex min-h-screen">
          {/* Mobile sidebar */}
          <div
            className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden ${
              sidebarOpen ? "block" : "hidden"
            }`}
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar />
          </div>

          {/* Main content */}
          <div className="flex flex-1 flex-col">
            <Navigation onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>

          <SearchCommand />
        </div>
      </ErrorBoundary>
    </AnalyticsProvider>
  )
} 