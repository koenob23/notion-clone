import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Page } from "@prisma/client"

interface PageCardProps {
  page: Page
}

export const PageCard = ({ page }: PageCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-1">
          {page.title || "Untitled"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {page.content || "No content"}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
        </p>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/pages/${page.id}`}>
            Open
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
} 