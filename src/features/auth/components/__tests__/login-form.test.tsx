import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/test/test-utils";
import { LoginForm } from "../login-form";

const mockLogin = vi.fn();
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("../../hooks/use-auth", () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoggingIn: false,
    user: null,
    isAuthenticated: false,
    register: vi.fn(),
    logout: vi.fn(),
    isRegistering: false,
    isLoggingOut: false,
    isLoading: false,
  }),
}));

beforeEach(() => {
  mockLogin.mockReset();
  mockPush.mockReset();
});

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it("calls login on valid submit and redirects", async () => {
    mockLogin.mockResolvedValueOnce({
      id: "1",
      email: "user@kpi.ua",
      firstName: "Test",
      lastName: "User",
      capabilityTier: 1,
    });

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "user@kpi.ua");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "user@kpi.ua",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("displays API error message on login failure", async () => {
    const { ApiError } = await import("@/shared/types/api");
    mockLogin.mockRejectedValueOnce(
      new ApiError({
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "Invalid email or password",
      }),
    );

    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "user@kpi.ua");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid email or password");
    });
  });
});
