"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Page } from "@prisma/client"

interface PageEditorProps {
  initialContent?: string
  pageId: string
  onSave?: () => void
}

export function PageEditor({ initialContent = '', pageId, onSave }: PageEditorProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      setSaveStatus('saving')
      setIsSaving(true)
    },
  })

  useEffect(() => {
    const saveTimeout = setTimeout(async () => {
      if (!editor || !isSaving) return

      try {
        const response = await fetch(`/api/pages/${pageId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: editor.getHTML(),
          }),
        })

        if (!response.ok) throw new Error('Failed to save')

        setSaveStatus('saved')
        onSave?.()
      } catch (error) {
        setSaveStatus('error')
        console.error('Failed to save page:', error)
      } finally {
        setIsSaving(false)
      }
    }, 1000)

    return () => clearTimeout(saveTimeout)
  }, [editor, isSaving, pageId, onSave])

  if (!editor) return null

  return (
    <div className="relative min-h-[500px] w-full max-w-4xl mx-auto p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {saveStatus === 'saving' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </div>
        )}
        {saveStatus === 'saved' && (
          <div className="text-sm text-muted-foreground">All changes saved</div>
        )}
        {saveStatus === 'error' && (
          <div className="text-sm text-destructive">Failed to save</div>
        )}
      </div>
      <EditorContent editor={editor} className="prose prose-sm max-w-none" />
    </div>
  )
} 