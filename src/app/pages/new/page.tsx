import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageEditor } from "@/components/page-editor"
import { Sidebar } from "@/components/sidebar"
import { auth } from "@clerk/nextjs"

export default async function NewPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <PageEditor
          onSave={async (data) => {
            "use server"
            const page = await prisma.page.create({
              data: {
                title: data.title,
                content: data.content,
                userId,
              },
            })
            redirect(`/pages/${page.id}`)
          }}
        />
      </div>
    </div>
  )
} 