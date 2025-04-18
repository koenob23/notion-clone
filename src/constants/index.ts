export const EDITOR_AUTOSAVE_INTERVAL = 1000; // 1 second
export const EDITOR_MAX_HISTORY = 10; // Maximum number of versions to keep
export const EDITOR_PLACEHOLDER = "Start writing...";

export const SEARCH_DEBOUNCE_DELAY = 300; // 300ms
export const SEARCH_MIN_LENGTH = 2; // Minimum length for search query

export const TOAST_DURATION = 3000; // 3 seconds
export const TOAST_POSITION = "bottom-right";

export const SIDEBAR_WIDTH = 256; // 16rem
export const SIDEBAR_COLLAPSED_WIDTH = 64; // 4rem

export const NAVIGATION_HEIGHT = 56; // 3.5rem

export const API_ROUTES = {
  PAGES: "/api/pages",
  PAGE: (id: string) => `/api/pages/${id}`,
  TASKS: "/api/tasks",
  TASK: (id: string) => `/api/tasks/${id}`,
  VERSIONS: (pageId: string) => `/api/pages/${pageId}/versions`,
  VERSION: (pageId: string, versionId: string) => `/api/pages/${pageId}/versions/${versionId}`,
} as const;

export const APP_ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  PAGES: "/pages",
  PAGE: (id: string) => `/pages/${id}`,
  NEW_PAGE: "/pages/new",
  TASKS: "/tasks",
  TASK: (id: string) => `/tasks/${id}`,
  NEW_TASK: "/tasks/new",
  SETTINGS: "/settings",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
} as const; 