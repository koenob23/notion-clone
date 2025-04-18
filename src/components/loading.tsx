import { Loader } from "lucide-react"

import { cn } from "@/lib/utils"

interface LoadingProps {
  size?: number
  className?: string
}

export const Loading = ({ size = 24, className }: LoadingProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader className="animate-spin" size={size} />
    </div>
  )
} 