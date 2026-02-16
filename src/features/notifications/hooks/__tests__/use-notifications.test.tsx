import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../api", () => ({
  getNotifications: vi.fn(),
}));

import { getNotifications } from "../../api";
import { useNotifications } from "../use-notifications";

const mockedGetNotifications = vi.mocked(getNotifications);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches notifications successfully", async () => {
    mockedGetNotifications.mockResolvedValueOnce({
      content: [],
      totalElements: 0,
      totalPages: 0,
      page: 0,
      size: 20,
      first: true,
      last: true,
    });

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGetNotifications).toHaveBeenCalledWith(undefined);
  });

  it("includes filters in the query key", async () => {
    mockedGetNotifications.mockResolvedValueOnce({
      content: [],
      totalElements: 0,
      totalPages: 0,
      page: 0,
      size: 10,
      first: true,
      last: true,
    });

    const filters = { category: "SECURITY" as const, read: false, size: 10 };

    const { result } = renderHook(() => useNotifications(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGetNotifications).toHaveBeenCalledWith(filters);
  });

  it("returns loading state initially", () => {
    mockedGetNotifications.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
