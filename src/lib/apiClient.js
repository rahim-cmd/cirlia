import { API_BASE_URL } from "../config/api";
import { getStoredToken } from "../utils/auth";

const defaultHeaders = {
  Accept: "application/json",
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(payload?.message || "Request failed.");
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

const buildHeaders = (customHeaders = {}, requiresAuth = false, body) => {
  const headers = new Headers(defaultHeaders);

  Object.entries(customHeaders).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      headers.set(key, value);
    }
  });

  if (requiresAuth) {
    const token = getStoredToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
};

export const apiClient = {
  async request(path, options = {}) {
    const { body, headers, requiresAuth = false, ...restOptions } = options;
    const requestBody = body instanceof FormData || body === undefined ? body : JSON.stringify(body);

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...restOptions,
      headers: buildHeaders(headers, requiresAuth, body),
      body: requestBody,
    });

    return parseResponse(response);
  },

  get(path, options = {}) {
    return this.request(path, { ...options, method: "GET" });
  },

  post(path, body, options = {}) {
    return this.request(path, { ...options, method: "POST", body });
  },

  put(path, body, options = {}) {
    return this.request(path, { ...options, method: "PUT", body });
  },

  delete(path, options = {}) {
    return this.request(path, { ...options, method: "DELETE" });
  },
};