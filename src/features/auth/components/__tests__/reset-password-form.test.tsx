import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import { ResetPasswordForm } from "../reset-password-form";

const mockResetPassword = vi.fn();
const mockSearchParams = vi.fn(() => new URLSearchParams("token=test-token"));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => mockSearchParams(),
}));

vi.mock("../../api", () => ({
  resetPassword: (...args: unknown[]) => mockResetPassword(...args),
}));

beforeEach(() => {
  mockResetPassword.mockReset();
  mockSearchParams.mockReturnValue(new URLSearchParams("token=test-token"));
});

describe("ResetPasswordForm", () => {
  it("shows error when no token in URL", () => {
    mockSearchParams.mockReturnValue(new URLSearchParams());
    render(<ResetPasswordForm />);

    expect(screen.getByRole("alert")).toHaveTextContent(/invalid or expired/i);
    expect(screen.getByRole("link", { name: /forgot password/i })).toBeInTheDocument();
  });

  it("renders password fields when token present", () => {
    render(<ResetPasswordForm />);

    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm new password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("shows validation error for password mismatch", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await user.type(screen.getByLabelText("New password"), "password123");
    await user.type(screen.getByLabelText("Confirm new password"), "different456");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("calls resetPassword API on valid submit and shows success", async () => {
    mockResetPassword.mockResolvedValueOnce(undefined);

    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await user.type(screen.getByLabelText("New password"), "newpassword123");
    await user.type(screen.getByLabelText("Confirm new password"), "newpassword123");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith("test-token", "newpassword123");
    });

    await waitFor(() => {
      expect(screen.getByText(/password has been reset successfully/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: /back to login/i })).toBeInTheDocument();
  });

  it("shows error message for expired/invalid token", async () => {
    const { ApiError } = await import("@/shared/types/api");
    mockResetPassword.mockRejectedValueOnce(
      new ApiError({
        type: "about:blank",
        title: "Bad Request",
        status: 400,
        detail: "Token has expired",
      }),
    );

    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await user.type(screen.getByLabelText("New password"), "newpassword123");
    await user.type(screen.getByLabelText("Confirm new password"), "newpassword123");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Token has expired");
    });
  });
});
