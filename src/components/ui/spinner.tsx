import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
}

export const Spinner = ({ size = 16, className, ...props }: SpinnerProps) => {
  return (
    <div
      className={cn("animate-spin text-muted-foreground", className)}
      {...props}
    >
      <Loader size={size} />
    </div>
  )
} 