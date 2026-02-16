import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/test-utils";
import type { NotificationDto } from "../../types";
import { NotificationItem } from "../notification-item";

function createNotification(overrides?: Partial<NotificationDto>): NotificationDto {
  return {
    id: "notif-1",
    userId: "user-1",
    titleKey: "notification.security.login",
    bodyKey: "notification.security.login.body",
    bodyArgs: null,
    category: "SECURITY",
    sourceModule: "module-auth",
    relatedEntityId: null,
    relatedEntityType: null,
    read: false,
    readAt: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("NotificationItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the notification title", () => {
    render(<NotificationItem notification={createNotification()} />);

    // The title is rendered inside a <span> with font-medium class
    const titleEl = document.querySelector(".font-medium");
    expect(titleEl).toBeInTheDocument();
    expect(titleEl?.textContent).toContain("notification.security.login");
  });

  it("renders the notification body", () => {
    render(<NotificationItem notification={createNotification()} />);

    const bodyEl = document.querySelector("p.text-muted-foreground");
    expect(bodyEl).toBeInTheDocument();
    expect(bodyEl?.textContent).toContain("notification.security.login.body");
  });

  it("renders the category badge", () => {
    render(<NotificationItem notification={createNotification()} />);

    expect(screen.getByText("Security")).toBeInTheDocument();
  });

  it("shows unread indicator for unread notifications", () => {
    const { container } = render(
      <NotificationItem notification={createNotification({ read: false })} />,
    );

    const indicator = container.querySelector(".rounded-full.bg-primary");
    expect(indicator).toBeInTheDocument();
  });

  it("does not show unread indicator for read notifications", () => {
    const { container } = render(
      <NotificationItem
        notification={createNotification({ read: true, readAt: new Date().toISOString() })}
      />,
    );

    const indicator = container.querySelector(".rounded-full.bg-primary");
    expect(indicator).not.toBeInTheDocument();
  });

  it("calls onMarkRead when mark-read button is clicked", async () => {
    const onMarkRead = vi.fn();
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();

    render(
      <NotificationItem
        notification={createNotification({ read: false })}
        onMarkRead={onMarkRead}
      />,
    );

    const button = screen.getByTitle("Mark as read");
    await user.click(button);

    expect(onMarkRead).toHaveBeenCalledWith("notif-1");
  });

  it("does not render mark-read button for read notifications", () => {
    const onMarkRead = vi.fn();

    render(
      <NotificationItem
        notification={createNotification({ read: true, readAt: new Date().toISOString() })}
        onMarkRead={onMarkRead}
      />,
    );

    expect(screen.queryByTitle("Mark as read")).not.toBeInTheDocument();
  });

  it("does not render mark-read button when onMarkRead is not provided", () => {
    render(<NotificationItem notification={createNotification({ read: false })} />);

    expect(screen.queryByTitle("Mark as read")).not.toBeInTheDocument();
  });
});
