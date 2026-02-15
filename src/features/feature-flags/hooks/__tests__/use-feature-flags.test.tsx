import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../api", () => ({
  getFeatureFlags: vi.fn(),
}));

import { getFeatureFlags } from "../../api";
import { useFeatureFlags } from "../use-feature-flags";

const mockedGetFeatureFlags = vi.mocked(getFeatureFlags);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useFeatureFlags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns feature flags from API", async () => {
    mockedGetFeatureFlags.mockResolvedValueOnce({ "flag.a": true, "flag.b": false });

    const { result } = renderHook(() => useFeatureFlags(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ "flag.a": true, "flag.b": false });
  });

  it("returns undefined data while loading", () => {
    mockedGetFeatureFlags.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useFeatureFlags(), { wrapper: createWrapper() });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
  });

  it("handles API error gracefully", async () => {
    mockedGetFeatureFlags.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFeatureFlags(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("calls getFeatureFlags API function", async () => {
    mockedGetFeatureFlags.mockResolvedValueOnce({});

    renderHook(() => useFeatureFlags(), { wrapper: createWrapper() });

    await waitFor(() => expect(mockedGetFeatureFlags).toHaveBeenCalledOnce());
  });

  it("returns empty object when API returns empty flags", async () => {
    mockedGetFeatureFlags.mockResolvedValueOnce({});

    const { result } = renderHook(() => useFeatureFlags(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({});
  });
});
