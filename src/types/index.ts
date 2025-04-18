import { Page, PageVersion, Task, User } from "@prisma/client";

export type { Page, PageVersion, Task, User };

export interface PageWithVersions extends Page {
  versions: PageVersion[];
}

export interface PageWithTasks extends Page {
  tasks: Task[];
}

export interface PageWithAll extends Page {
  versions: PageVersion[];
  tasks: Task[];
}

export interface TaskWithPage extends Task {
  page: Page | null;
}

export interface UserWithPages extends User {
  pages: Page[];
}

export interface UserWithTasks extends User {
  tasks: Task[];
}

export interface UserWithAll extends User {
  pages: Page[];
  tasks: Task[];
} 