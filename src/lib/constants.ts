export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const API_ROUTES = {
  auth: {
    login: "/api/v1/auth/login",
    register: "/api/v1/auth/register",
    logout: "/api/v1/auth/logout",
    refresh: "/api/v1/auth/refresh",
    me: "/api/v1/auth/me",
    forgotPassword: "/api/v1/auth/forgot-password",
    resetPassword: "/api/v1/auth/reset-password",
    googleOAuth: "/api/v1/auth/oauth2/google",
  },
  users: {
    base: "/api/v1/users",
    byId: (id: string) => `/api/v1/users/${id}`,
    tier: (id: string) => `/api/v1/users/${id}/tier`,
    status: (id: string) => `/api/v1/users/${id}/status`,
    partners: (id: string) => `/api/v1/users/${id}/partners`,
    partner: (id: string, partnerId: string) => `/api/v1/users/${id}/partners/${partnerId}`,
  },
  clubs: {
    base: "/api/v1/clubs",
    byId: (id: string) => `/api/v1/clubs/${id}`,
    members: (id: string) => `/api/v1/clubs/${id}/members`,
  },
  projects: {
    base: "/api/v1/projects",
    byId: (id: string) => `/api/v1/projects/${id}`,
    members: (id: string) => `/api/v1/projects/${id}/members`,
  },
  departments: {
    base: "/api/v1/departments",
    byId: (id: string) => `/api/v1/departments/${id}`,
  },
  documents: {
    base: "/api/v1/documents",
    byId: (id: string) => `/api/v1/documents/${id}`,
  },
  notifications: {
    base: "/api/v1/notifications",
    byId: (id: string) => `/api/v1/notifications/${id}`,
    markRead: (id: string) => `/api/v1/notifications/${id}/read`,
  },
} as const;
