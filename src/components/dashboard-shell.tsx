import { ReactNode } from "react"

interface DashboardShellProps {
  children: ReactNode
}

export const DashboardShell = ({ children }: DashboardShellProps) => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        {children}
      </div>
    </div>
  )
} 