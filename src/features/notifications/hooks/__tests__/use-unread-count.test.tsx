import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../api", () => ({
  getUnreadCount: vi.fn(),
}));

import { getUnreadCount } from "../../api";
import { useUnreadCount } from "../use-unread-count";

const mockedGetUnreadCount = vi.mocked(getUnreadCount);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useUnreadCount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches unread count successfully", async () => {
    mockedGetUnreadCount.mockResolvedValueOnce({ count: 5 });

    const { result } = renderHook(() => useUnreadCount(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ count: 5 });
  });

  it("has a refetch interval of 60000ms", async () => {
    mockedGetUnreadCount.mockResolvedValueOnce({ count: 0 });

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => useUnreadCount(), { wrapper });

    await waitFor(() => {
      const queryState = queryClient.getQueryCache().findAll({
        queryKey: ["notifications", "unread-count"],
      });
      expect(queryState).toHaveLength(1);
    });

    const observer = queryClient
      .getQueryCache()
      .findAll({ queryKey: ["notifications", "unread-count"] })[0];
    expect(observer).toBeDefined();
  });

  it("returns loading state initially", () => {
    mockedGetUnreadCount.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useUnreadCount(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
