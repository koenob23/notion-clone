import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useAutosave } from "./use-autosave";
import { EDITOR_PLACEHOLDER } from "@/constants";

interface UsePageEditorOptions {
  initialContent: string;
  pageId: string;
  onSave?: () => void;
}

export function usePageEditor({
  initialContent,
  pageId,
  onSave,
}: UsePageEditorOptions) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none",
      },
    },
    editable: true,
    autofocus: "end",
    parseOptions: {
      preserveWhitespace: true,
    },
  });

  const { isSaving, saveStatus } = useAutosave({
    data: editor?.getHTML() || "",
    onSave: async (content) => {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      onSave?.();
    },
    enabled: !!editor,
  });

  return {
    editor,
    isSaving,
    saveStatus,
  };
} 