import { STORAGE_KEYS } from "../config/api";

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return atob(normalized);
};

export const extractAuthToken = (payload) => {
  const candidates = [
    payload?.token,
    payload?.accessToken,
    payload?.access_token,
    payload?.data?.token,
    payload?.data?.accessToken,
    payload?.data?.access_token,
    payload?.data?.auth?.token,
    payload?.data?.auth?.accessToken,
    payload?.data?.auth?.access_token,
    payload?.auth?.token,
    payload?.auth?.accessToken,
    payload?.auth?.access_token,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return "";
};

export const normalizeRole = (user) => {
  const role = user?.role || user?.user_role || user?.data?.role || "user";
  return typeof role === "string" ? role.toLowerCase() : "user";
};

export const normalizeUser = (payload) => {
  const rawUser = payload?.user || payload?.data?.user || payload?.data || payload || {};
  const firstName = rawUser?.first_name || rawUser?.firstName || rawUser?.name?.split(" ")[0] || "";
  const lastName = rawUser?.last_name || rawUser?.lastName || rawUser?.name?.split(" ").slice(1).join(" ") || "";

  return {
    ...rawUser,
    first_name: firstName,
    last_name: lastName,
    email: rawUser?.email || "",
    role: normalizeRole(rawUser),
  };
};

export const getStoredToken = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return (localStorage.getItem(STORAGE_KEYS.token) || "").trim();
};

export const getStoredUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = localStorage.getItem(STORAGE_KEYS.user);

  if (!rawUser) {
    return null;
  }

  try {
    return normalizeUser(JSON.parse(rawUser));
  } catch {
    return null;
  }
};

export const getStoredRole = () => {
  const storedUser = getStoredUser();

  if (storedUser?.role) {
    return storedUser.role;
  }

  if (typeof window === "undefined") {
    return "user";
  }

  return (localStorage.getItem(STORAGE_KEYS.role) || "user").toLowerCase();
};

export const getStoredUserId = () => {
  const storedUser = getStoredUser();
  const directId = storedUser?.id || storedUser?.user_id || storedUser?.userId;

  if (directId !== undefined && directId !== null && directId !== "") {
    return directId;
  }

  const token = getStoredToken();

  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const decodedPayload = JSON.parse(decodeBase64Url(payload));
    return decodedPayload?.id || decodedPayload?.user_id || decodedPayload?.userId || null;
  } catch {
    return null;
  }
};

export const persistSession = ({ token, user }) => {
  const normalizedUser = normalizeUser(user);
  const fullName = `${normalizedUser.first_name || ""} ${normalizedUser.last_name || ""}`.trim();

  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(normalizedUser));
  localStorage.setItem(STORAGE_KEYS.role, normalizeRole(normalizedUser));
  localStorage.setItem(STORAGE_KEYS.userName, fullName || normalizedUser.name || normalizedUser.email || "member");
  window.dispatchEvent(new Event("auth:changed"));
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.role);
  localStorage.removeItem(STORAGE_KEYS.userName);
  localStorage.removeItem("userBookings");
  localStorage.removeItem("dashboardBooking");
  window.dispatchEvent(new Event("auth:changed"));
};