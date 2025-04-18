import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { TaskList } from "@/components/task-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default async function TasksPage() {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Tasks"
        text="Manage your tasks and track your progress."
      />
      <div className="grid gap-8">
        <TaskList />
      </div>
    </DashboardShell>
  )
} 