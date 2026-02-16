import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import { NotificationBell } from "../notification-bell";

const mockPush = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("../../hooks/use-unread-count", () => ({
  useUnreadCount: vi.fn(),
}));

vi.mock("../../hooks/use-notifications", () => ({
  useNotifications: vi.fn(),
}));

vi.mock("../../hooks/use-mark-read", () => ({
  useMarkReadMutation: () => ({ mutate: vi.fn() }),
  useMarkAllReadMutation: () => ({ mutate: vi.fn() }),
}));

vi.mock("../../hooks/use-notification-sse", () => ({
  useNotificationSSE: vi.fn(),
}));

import { useNotifications } from "../../hooks/use-notifications";
import { useUnreadCount } from "../../hooks/use-unread-count";

const mockedUseUnreadCount = vi.mocked(useUnreadCount);
const mockedUseNotifications = vi.mocked(useNotifications);

describe("NotificationBell", () => {
  it("renders the bell button", () => {
    mockedUseUnreadCount.mockReturnValue({ data: undefined } as ReturnType<typeof useUnreadCount>);
    mockedUseNotifications.mockReturnValue({ data: undefined } as ReturnType<
      typeof useNotifications
    >);

    render(<NotificationBell />);

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows unread badge when there are unread notifications", () => {
    mockedUseUnreadCount.mockReturnValue({
      data: { count: 3 },
    } as ReturnType<typeof useUnreadCount>);
    mockedUseNotifications.mockReturnValue({ data: undefined } as ReturnType<
      typeof useNotifications
    >);

    render(<NotificationBell />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not show unread badge when count is zero", () => {
    mockedUseUnreadCount.mockReturnValue({
      data: { count: 0 },
    } as ReturnType<typeof useUnreadCount>);
    mockedUseNotifications.mockReturnValue({ data: undefined } as ReturnType<
      typeof useNotifications
    >);

    render(<NotificationBell />);

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("shows 99+ when unread count exceeds 99", () => {
    mockedUseUnreadCount.mockReturnValue({
      data: { count: 150 },
    } as ReturnType<typeof useUnreadCount>);
    mockedUseNotifications.mockReturnValue({ data: undefined } as ReturnType<
      typeof useNotifications
    >);

    render(<NotificationBell />);

    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("does not show badge when unread data is undefined", () => {
    mockedUseUnreadCount.mockReturnValue({ data: undefined } as ReturnType<typeof useUnreadCount>);
    mockedUseNotifications.mockReturnValue({ data: undefined } as ReturnType<
      typeof useNotifications
    >);

    const { container } = render(<NotificationBell />);

    const badge = container.querySelector(".bg-destructive");
    expect(badge).not.toBeInTheDocument();
  });
});
