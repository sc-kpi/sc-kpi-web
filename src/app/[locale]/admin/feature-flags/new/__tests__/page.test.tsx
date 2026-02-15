import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import AdminCreateFeatureFlagPage from "../page";

const mockMutate = vi.fn();
const mockPush = vi.fn();

vi.mock("@/features/feature-flags/hooks", () => ({
  useCreateFeatureFlagMutation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AdminCreateFeatureFlagPage", () => {
  it("renders create form with all fields", () => {
    render(<AdminCreateFeatureFlagPage />);

    expect(screen.getByLabelText(/key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enabled/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/environment/i)).toBeInTheDocument();
  });

  it("submits form with valid data", async () => {
    mockMutate.mockImplementation((_data: unknown, options: { onSuccess: () => void }) => {
      options.onSuccess();
    });

    const user = userEvent.setup();
    render(<AdminCreateFeatureFlagPage />);

    await user.type(screen.getByLabelText(/key/i), "new.flag");
    await user.type(screen.getByLabelText(/name/i), "New Flag");

    const submitButton = screen.getByRole("button", { name: /create/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it("renders cancel button that navigates back", async () => {
    const user = userEvent.setup();
    render(<AdminCreateFeatureFlagPage />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockPush).toHaveBeenCalledWith("/admin/feature-flags");
  });
});
