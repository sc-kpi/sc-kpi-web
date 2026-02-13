import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import { ForgotPasswordForm } from "../forgot-password-form";

const mockForgotPassword = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("../../api", () => ({
  forgotPassword: (...args: unknown[]) => mockForgotPassword(...args),
}));

beforeEach(() => {
  mockForgotPassword.mockReset();
});

describe("ForgotPasswordForm", () => {
  it("renders email field and submit button", () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("shows validation error on empty submit", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it("calls forgotPassword API on valid submit and shows success message", async () => {
    mockForgotPassword.mockResolvedValueOnce(undefined);

    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email/i), "user@kpi.ua");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith("user@kpi.ua");
    });

    await waitFor(() => {
      expect(screen.getByText(/reset link has been sent/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: /back to login/i })).toBeInTheDocument();
  });

  it("shows error message on API failure", async () => {
    const { ApiError } = await import("@/shared/types/api");
    mockForgotPassword.mockRejectedValueOnce(
      new ApiError({
        type: "about:blank",
        title: "Bad Request",
        status: 400,
        detail: "Unable to process request",
      }),
    );

    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email/i), "user@kpi.ua");
    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Unable to process request");
    });
  });
});
