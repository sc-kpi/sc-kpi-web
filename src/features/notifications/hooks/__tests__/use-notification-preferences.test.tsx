import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../api", () => ({
  getPreferences: vi.fn(),
  updatePreferences: vi.fn(),
}));

import { getPreferences } from "../../api";
import { useNotificationPreferences } from "../use-notification-preferences";

const mockedGetPreferences = vi.mocked(getPreferences);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useNotificationPreferences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches preferences successfully", async () => {
    const mockPreferences = [
      { category: "SECURITY", channel: "IN_APP", enabled: true },
      { category: "ADMIN", channel: "EMAIL", enabled: false },
    ];
    mockedGetPreferences.mockResolvedValueOnce(mockPreferences);

    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPreferences);
  });

  it("returns loading state initially", () => {
    mockedGetPreferences.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("uses the correct query key", async () => {
    mockedGetPreferences.mockResolvedValueOnce([]);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    renderHook(() => useNotificationPreferences(), { wrapper });

    await waitFor(() => {
      const queries = queryClient.getQueryCache().findAll({
        queryKey: ["notifications", "preferences"],
      });
      expect(queries).toHaveLength(1);
    });
  });
});
