export const API_BASE_URL = "https://api.circlia.uk/api/v1";

export const STORAGE_KEYS = {
  token: "token",
  user: "user",
  role: "role",
  userName: "userName",
};

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    profile: "/auth/profile",
    logout: "/auth/logout",
  },
  circles: {
    upcoming: "/circles/upcoming",
    adminList: "/circles/admin",
    adminById: (id) => `/circles/admin/${id}`,
    regenerateZoom: (id) => `/circles/admin/${id}/zoom/regenerate`,
    removeZoom: (id) => `/circles/admin/${id}/zoom`,
  },
  bookings: {
    create: "/bookings",
    mine: "/bookings/my",
    adminList: "/bookings/admin",
    cancel: (id) => `/bookings/${id}/cancel`,
    approve: (id) => `/bookings/${id}/approve`,
    reject: (id) => `/bookings/${id}/reject`,
    updateStatus: (id) => `/bookings/${id}/status`,
  },
  users: {
    list: "/users",
    byId: (id) => `/users/${id}`,
  },
  health: {
    zoom: "/health/zoom",
  },
  zoom: {
    detailsByCircleId: (id) => `/zoom/circles/${id}`,
    logsByCircleId: (id) => `/zoom/circles/${id}/logs`,
    resyncByCircleId: (id) => `/zoom/circles/${id}/resync`,
  },
};