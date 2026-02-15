import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../api", () => ({
  getAdminFeatureFlags: vi.fn(),
  getAdminFeatureFlag: vi.fn(),
  createFeatureFlag: vi.fn(),
  updateFeatureFlag: vi.fn(),
  toggleFeatureFlag: vi.fn(),
  deleteFeatureFlag: vi.fn(),
  addOverride: vi.fn(),
  removeOverride: vi.fn(),
  getAuditLog: vi.fn(),
}));

import {
  addOverride,
  createFeatureFlag,
  deleteFeatureFlag,
  getAdminFeatureFlag,
  getAdminFeatureFlags,
  getAuditLog,
  removeOverride,
  toggleFeatureFlag,
  updateFeatureFlag,
} from "../../api";
import type { FeatureFlagDto } from "../../types";
import {
  useAddOverrideMutation,
  useAdminFeatureFlag,
  useAdminFeatureFlags,
  useCreateFeatureFlagMutation,
  useDeleteFeatureFlagMutation,
  useFeatureFlagAuditLog,
  useRemoveOverrideMutation,
  useToggleFeatureFlagMutation,
  useUpdateFeatureFlagMutation,
} from "../use-admin-feature-flags";

const mockedGetAdminFeatureFlags = vi.mocked(getAdminFeatureFlags);
const mockedGetAdminFeatureFlag = vi.mocked(getAdminFeatureFlag);
const mockedCreateFeatureFlag = vi.mocked(createFeatureFlag);
const mockedUpdateFeatureFlag = vi.mocked(updateFeatureFlag);
const mockedToggleFeatureFlag = vi.mocked(toggleFeatureFlag);
const mockedDeleteFeatureFlag = vi.mocked(deleteFeatureFlag);
const mockedAddOverride = vi.mocked(addOverride);
const mockedRemoveOverride = vi.mocked(removeOverride);
const mockedGetAuditLog = vi.mocked(getAuditLog);

const sampleFlag: FeatureFlagDto = {
  id: "flag-1",
  key: "test.flag",
  name: "Test Flag",
  description: null,
  enabled: true,
  environment: null,
  rolloutPercentage: 100,
  overrides: [],
  createdBy: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useAdminFeatureFlags", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated list", async () => {
    mockedGetAdminFeatureFlags.mockResolvedValueOnce({
      content: [sampleFlag],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    });

    const { result } = renderHook(() => useAdminFeatureFlags(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.content).toHaveLength(1);
    expect(result.current.data?.content[0].key).toBe("test.flag");
  });
});

describe("useAdminFeatureFlag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns single flag detail", async () => {
    mockedGetAdminFeatureFlag.mockResolvedValueOnce(sampleFlag);

    const { result } = renderHook(() => useAdminFeatureFlag("flag-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.key).toBe("test.flag");
  });
});

describe("useCreateFeatureFlagMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API and succeeds", async () => {
    mockedCreateFeatureFlag.mockResolvedValueOnce(sampleFlag);

    const { result } = renderHook(() => useCreateFeatureFlagMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      key: "test.flag",
      name: "Test Flag",
      description: "",
      enabled: true,
      environment: "",
      rolloutPercentage: 100,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedCreateFeatureFlag).toHaveBeenCalledOnce();
  });

  it("handles validation error", async () => {
    mockedCreateFeatureFlag.mockRejectedValueOnce(new Error("Bad Request"));

    const { result } = renderHook(() => useCreateFeatureFlagMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      key: "INVALID",
      name: "",
      description: "",
      enabled: true,
      environment: "",
      rolloutPercentage: 100,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useUpdateFeatureFlagMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls API with correct params", async () => {
    mockedUpdateFeatureFlag.mockResolvedValueOnce(sampleFlag);

    const { result } = renderHook(() => useUpdateFeatureFlagMutation("flag-1"), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ name: "Updated Name" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedUpdateFeatureFlag).toHaveBeenCalledWith("flag-1", { name: "Updated Name" });
  });
});

describe("useToggleFeatureFlagMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls toggle endpoint", async () => {
    mockedToggleFeatureFlag.mockResolvedValueOnce({ ...sampleFlag, enabled: false });

    const { result } = renderHook(() => useToggleFeatureFlagMutation("flag-1"), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ enabled: false });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedToggleFeatureFlag).toHaveBeenCalledWith("flag-1", { enabled: false });
  });
});

describe("useDeleteFeatureFlagMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls delete endpoint", async () => {
    mockedDeleteFeatureFlag.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDeleteFeatureFlagMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("flag-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedDeleteFeatureFlag).toHaveBeenCalledWith("flag-1");
  });

  it("handles not found error", async () => {
    mockedDeleteFeatureFlag.mockRejectedValueOnce(new Error("Not Found"));

    const { result } = renderHook(() => useDeleteFeatureFlagMutation(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("nonexistent");

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useAddOverrideMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls override endpoint", async () => {
    mockedAddOverride.mockResolvedValueOnce({
      id: "ovr-1",
      overrideType: "TIER",
      tierLevel: 5,
      userId: null,
      enabled: false,
    });

    const { result } = renderHook(() => useAddOverrideMutation("flag-1"), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ overrideType: "TIER", tierLevel: 5, enabled: false });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedAddOverride).toHaveBeenCalledWith("flag-1", {
      overrideType: "TIER",
      tierLevel: 5,
      enabled: false,
    });
  });
});

describe("useRemoveOverrideMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls remove override endpoint", async () => {
    mockedRemoveOverride.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useRemoveOverrideMutation("flag-1"), {
      wrapper: createWrapper(),
    });

    result.current.mutate("ovr-1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedRemoveOverride).toHaveBeenCalledWith("flag-1", "ovr-1");
  });
});

describe("useFeatureFlagAuditLog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns paginated audit entries", async () => {
    mockedGetAuditLog.mockResolvedValueOnce({
      content: [
        {
          id: "audit-1",
          flagId: "flag-1",
          flagKey: "test.flag",
          action: "CREATED",
          fieldName: null,
          oldValue: null,
          newValue: "true",
          reason: null,
          changedBy: null,
          changedAt: "2024-01-01T00:00:00Z",
        },
      ],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    });

    const { result } = renderHook(() => useFeatureFlagAuditLog("flag-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.content).toHaveLength(1);
    expect(result.current.data?.content[0].action).toBe("CREATED");
  });
});
