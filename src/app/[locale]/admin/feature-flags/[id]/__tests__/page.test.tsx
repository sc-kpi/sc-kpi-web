import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FeatureFlagDto } from "@/features/feature-flags/types";
import { render, screen } from "@/test/test-utils";
import AdminFeatureFlagDetailPage from "../page";

const mockUpdateMutate = vi.fn();
const mockAddOverrideMutate = vi.fn();
const mockRemoveOverrideMutate = vi.fn();
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "flag-1" }),
}));

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const sampleFlag: FeatureFlagDto = {
  id: "flag-1",
  key: "test.flag",
  name: "Test Flag",
  description: "A test flag description",
  enabled: true,
  environment: "dev",
  rolloutPercentage: 75,
  overrides: [
    {
      id: "ovr-1",
      overrideType: "TIER",
      tierLevel: 5,
      userId: null,
      enabled: false,
    },
  ],
  createdBy: "user-1",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const auditData = {
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
      changedBy: "user-1",
      changedAt: "2024-01-01T00:00:00Z",
    },
  ],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
};

vi.mock("@/features/feature-flags/hooks", () => ({
  useAdminFeatureFlag: vi.fn(),
  useUpdateFeatureFlagMutation: () => ({
    mutate: mockUpdateMutate,
    isPending: false,
  }),
  useAddOverrideMutation: () => ({
    mutate: mockAddOverrideMutate,
    isPending: false,
  }),
  useRemoveOverrideMutation: () => ({
    mutate: mockRemoveOverrideMutate,
    isPending: false,
  }),
  useFeatureFlagAuditLog: vi.fn(),
}));

import { useAdminFeatureFlag, useFeatureFlagAuditLog } from "@/features/feature-flags/hooks";

const mockedUseAdminFeatureFlag = vi.mocked(useAdminFeatureFlag);
const mockedUseFeatureFlagAuditLog = vi.mocked(useFeatureFlagAuditLog);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AdminFeatureFlagDetailPage", () => {
  it("renders edit form with pre-filled data", () => {
    mockedUseAdminFeatureFlag.mockReturnValue({
      data: sampleFlag,
      isLoading: false,
    } as ReturnType<typeof useAdminFeatureFlag>);
    mockedUseFeatureFlagAuditLog.mockReturnValue({
      data: auditData,
    } as ReturnType<typeof useFeatureFlagAuditLog>);

    render(<AdminFeatureFlagDetailPage />);

    expect(screen.getByDisplayValue("Test Flag")).toBeInTheDocument();
    expect(screen.getByDisplayValue("A test flag description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("75")).toBeInTheDocument();
  });

  it("displays overrides table", () => {
    mockedUseAdminFeatureFlag.mockReturnValue({
      data: sampleFlag,
      isLoading: false,
    } as ReturnType<typeof useAdminFeatureFlag>);
    mockedUseFeatureFlagAuditLog.mockReturnValue({
      data: auditData,
    } as ReturnType<typeof useFeatureFlagAuditLog>);

    render(<AdminFeatureFlagDetailPage />);

    expect(screen.getByText("TIER")).toBeInTheDocument();
    expect(screen.getByText("Tier 5")).toBeInTheDocument();
  });

  it("displays audit log table", () => {
    mockedUseAdminFeatureFlag.mockReturnValue({
      data: sampleFlag,
      isLoading: false,
    } as ReturnType<typeof useAdminFeatureFlag>);
    mockedUseFeatureFlagAuditLog.mockReturnValue({
      data: auditData,
    } as ReturnType<typeof useFeatureFlagAuditLog>);

    render(<AdminFeatureFlagDetailPage />);

    expect(screen.getByText("CREATED")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockedUseAdminFeatureFlag.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useAdminFeatureFlag>);
    mockedUseFeatureFlagAuditLog.mockReturnValue({
      data: undefined,
    } as ReturnType<typeof useFeatureFlagAuditLog>);

    render(<AdminFeatureFlagDetailPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
