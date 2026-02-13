import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { API_BASE_URL, API_ROUTES } from "@/lib/constants";
import { render, screen } from "@/test/test-utils";
import { GoogleSignInButton } from "../google-sign-in-button";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("GoogleSignInButton", () => {
  it("renders button with correct text", () => {
    render(<GoogleSignInButton />);

    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
  });

  it("redirects to Google OAuth URL on click", async () => {
    const hrefSetter = vi.fn();
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
    Object.defineProperty(window.location, "href", {
      set: hrefSetter,
      get: () => "",
    });

    const user = userEvent.setup();
    render(<GoogleSignInButton />);

    await user.click(screen.getByRole("button", { name: /continue with google/i }));

    expect(hrefSetter).toHaveBeenCalledWith(API_BASE_URL + API_ROUTES.auth.googleOAuth);
  });
});
