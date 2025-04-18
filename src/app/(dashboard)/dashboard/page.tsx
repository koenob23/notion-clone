import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { PageList } from "@/components/page-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default async function DashboardPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome to your dashboard. Here's an overview of your workspace."
      />
      <div className="grid gap-8">
        <PageList />
      </div>
    </DashboardShell>
  )
} 