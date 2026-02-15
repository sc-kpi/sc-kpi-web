import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { FeatureFlag } from "../feature-flag";

vi.mock("../../hooks/use-feature-flag", () => ({
  useFeatureFlag: vi.fn(),
}));

import { useFeatureFlag } from "../../hooks/use-feature-flag";

const mockedUseFeatureFlag = vi.mocked(useFeatureFlag);

describe("FeatureFlag", () => {
  it("renders children when flag is enabled", () => {
    mockedUseFeatureFlag.mockReturnValue(true);

    render(
      <FeatureFlag flag="test.flag">
        <span>Visible content</span>
      </FeatureFlag>,
    );

    expect(screen.getByText("Visible content")).toBeInTheDocument();
  });

  it("renders fallback when flag is disabled", () => {
    mockedUseFeatureFlag.mockReturnValue(false);

    render(
      <FeatureFlag flag="test.flag" fallback={<span>Not available</span>}>
        <span>Visible content</span>
      </FeatureFlag>,
    );

    expect(screen.queryByText("Visible content")).not.toBeInTheDocument();
    expect(screen.getByText("Not available")).toBeInTheDocument();
  });

  it("renders nothing when flag is disabled and no fallback", () => {
    mockedUseFeatureFlag.mockReturnValue(false);

    const { container } = render(
      <FeatureFlag flag="test.flag">
        <span>Visible content</span>
      </FeatureFlag>,
    );

    expect(screen.queryByText("Visible content")).not.toBeInTheDocument();
    expect(container.innerHTML).toBe("");
  });
});
