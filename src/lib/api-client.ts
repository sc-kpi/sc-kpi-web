import { ApiError, type ProblemDetail } from "@/shared/types/api";
import { API_BASE_URL, API_ROUTES } from "./constants";

type RequestOptions = Omit<RequestInit, "method" | "body"> & {
  params?: Record<string, string>;
};

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.auth.refresh}`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function handleTokenRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = refreshToken().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (options?.params) {
    for (const [key, value] of Object.entries(options.params)) {
      url.searchParams.set(key, value);
    }
  }

  const { params: _, ...fetchOptions } = options ?? {};

  const headers = new Headers(fetchOptions?.headers);
  if (body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response = await fetch(url.toString(), {
    method,
    credentials: "include",
    ...fetchOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Rate limit handling
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const seconds = retryAfter ? Number.parseInt(retryAfter, 10) : 60;
    const contentType = response.headers.get("Content-Type") ?? "";
    if (
      contentType.includes("application/problem+json") ||
      contentType.includes("application/json")
    ) {
      const problem: ProblemDetail = await response.json();
      throw new ApiError({
        ...problem,
        detail: problem.detail || `Too many requests. Try again in ${seconds} seconds.`,
      });
    }
    throw new ApiError({
      type: "about:blank",
      title: "Too Many Requests",
      status: 429,
      detail: `Too many requests. Try again in ${seconds} seconds.`,
    });
  }

  // Auto-refresh on 401
  if (response.status === 401) {
    const refreshed = await handleTokenRefresh();
    if (refreshed) {
      response = await fetch(url.toString(), {
        method,
        credentials: "include",
        ...fetchOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    }
  }

  if (!response.ok) {
    const contentType = response.headers.get("Content-Type") ?? "";
    if (
      contentType.includes("application/problem+json") ||
      contentType.includes("application/json")
    ) {
      const problem: ProblemDetail = await response.json();
      throw new ApiError(problem);
    }
    throw new ApiError({
      type: "about:blank",
      title: response.statusText || "Request failed",
      status: response.status,
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text);
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};
