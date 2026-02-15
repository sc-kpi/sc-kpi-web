import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../api", () => ({
  getFeatureFlags: vi.fn(),
}));

import { getFeatureFlags } from "../../api";
import { useFeatureFlag } from "../use-feature-flag";

const mockedGetFeatureFlags = vi.mocked(getFeatureFlags);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useFeatureFlag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns true when flag is enabled", async () => {
    mockedGetFeatureFlags.mockResolvedValueOnce({ "test.flag": true });

    const { result } = renderHook(() => useFeatureFlag("test.flag"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current).toBe(true));
  });

  it("returns false when flag is disabled", async () => {
    mockedGetFeatureFlags.mockResolvedValueOnce({ "test.flag": false });

    const { result } = renderHook(() => useFeatureFlag("test.flag"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current).toBe(false));
  });

  it("returns false when flag key does not exist", async () => {
    mockedGetFeatureFlags.mockResolvedValueOnce({ "other.flag": true });

    const { result } = renderHook(() => useFeatureFlag("missing.flag"), {
      wrapper: createWrapper(),
    });

    // Initially false (loading), stays false (key not in data)
    expect(result.current).toBe(false);
    await waitFor(() => expect(result.current).toBe(false));
  });

  it("returns false while loading", () => {
    mockedGetFeatureFlags.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useFeatureFlag("test.flag"), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe(false);
  });

  it("reads flag with dots in key correctly", async () => {
    mockedGetFeatureFlags.mockResolvedValueOnce({ "my.dotted.flag.key": true });

    const { result } = renderHook(() => useFeatureFlag("my.dotted.flag.key"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current).toBe(true));
  });
});
