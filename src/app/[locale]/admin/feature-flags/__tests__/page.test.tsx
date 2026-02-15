import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import type { PaginatedResponse } from "@/shared/types/api";
import type { FeatureFlagDto } from "@/features/feature-flags/types";
import AdminFeatureFlagsPage from "../page";

const mockToggleMutate = vi.fn();
const mockDeleteMutate = vi.fn();

vi.mock("@/features/feature-flags/hooks", () => ({
  useAdminFeatureFlags: vi.fn(),
  useToggleFeatureFlagMutation: () => ({
    mutate: mockToggleMutate,
    isPending: false,
  }),
  useDeleteFeatureFlagMutation: () => ({
    mutate: mockDeleteMutate,
    isPending: false,
  }),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

import { useAdminFeatureFlags } from "@/features/feature-flags/hooks";

const mockedUseAdminFeatureFlags = vi.mocked(useAdminFeatureFlags);

const sampleFlag: FeatureFlagDto = {
  id: "flag-1",
  key: "test.flag",
  name: "Test Flag",
  description: null,
  enabled: true,
  environment: "dev",
  rolloutPercentage: 75,
  overrides: [],
  createdBy: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const paginatedFlags: PaginatedResponse<FeatureFlagDto> = {
  content: [sampleFlag],
  page: 0,
  size: 20,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AdminFeatureFlagsPage", () => {
  it("renders feature flags table with data", () => {
    mockedUseAdminFeatureFlags.mockReturnValue({
      data: paginatedFlags,
      isLoading: false,
    } as ReturnType<typeof useAdminFeatureFlags>);

    render(<AdminFeatureFlagsPage />);

    expect(screen.getByText("test.flag")).toBeInTheDocument();
    expect(screen.getByText("Test Flag")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("dev")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    mockedUseAdminFeatureFlags.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useAdminFeatureFlags>);

    render(<AdminFeatureFlagsPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders empty state when no flags exist", () => {
    const emptyPaginated: PaginatedResponse<FeatureFlagDto> = {
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
    };

    mockedUseAdminFeatureFlags.mockReturnValue({
      data: emptyPaginated,
      isLoading: false,
    } as ReturnType<typeof useAdminFeatureFlags>);

    render(<AdminFeatureFlagsPage />);

    // Table renders but no data rows
    expect(screen.queryByText("test.flag")).not.toBeInTheDocument();
  });

  it("renders create flag link", () => {
    mockedUseAdminFeatureFlags.mockReturnValue({
      data: paginatedFlags,
      isLoading: false,
    } as ReturnType<typeof useAdminFeatureFlags>);

    render(<AdminFeatureFlagsPage />);

    const createLink = screen.getByRole("link", { name: /create/i });
    expect(createLink).toHaveAttribute("href", "/admin/feature-flags/new");
  });

  it("renders edit link for each flag", () => {
    mockedUseAdminFeatureFlags.mockReturnValue({
      data: paginatedFlags,
      isLoading: false,
    } as ReturnType<typeof useAdminFeatureFlags>);

    render(<AdminFeatureFlagsPage />);

    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute("href", "/admin/feature-flags/flag-1");
  });
});
