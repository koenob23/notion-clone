import { z } from "zod"

export const pageSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().optional(),
})

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  completed: z.boolean().default(false),
  pageId: z.string().optional(),
})

export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  type: z.enum(["pages", "tasks"]).default("pages"),
})

export type PageFormData = z.infer<typeof pageSchema>
export type TaskFormData = z.infer<typeof taskSchema>
export type SearchFormData = z.infer<typeof searchSchema> 