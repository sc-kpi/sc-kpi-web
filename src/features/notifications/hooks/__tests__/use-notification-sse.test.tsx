import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useNotificationSSE } from "../use-notification-sse";

class MockEventSource {
  static instances: MockEventSource[] = [];
  url: string;
  options: Record<string, unknown>;
  listeners: Record<string, EventListener> = {};
  onerror: (() => void) | null = null;
  onopen: (() => void) | null = null;
  close = vi.fn();

  constructor(url: string, options?: Record<string, unknown>) {
    this.url = url;
    this.options = options ?? {};
    MockEventSource.instances.push(this);
  }

  addEventListener(event: string, listener: EventListener) {
    this.listeners[event] = listener;
  }
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useNotificationSSE", () => {
  beforeEach(() => {
    MockEventSource.instances = [];
    vi.stubGlobal("EventSource", MockEventSource);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates an EventSource when enabled", () => {
    renderHook(() => useNotificationSSE(true), {
      wrapper: createWrapper(),
    });

    expect(MockEventSource.instances).toHaveLength(1);
    expect(MockEventSource.instances[0].url).toContain("/notifications/stream");
  });

  it("creates an EventSource by default (enabled is true)", () => {
    renderHook(() => useNotificationSSE(), {
      wrapper: createWrapper(),
    });

    expect(MockEventSource.instances).toHaveLength(1);
  });

  it("does not create an EventSource when disabled", () => {
    renderHook(() => useNotificationSSE(false), {
      wrapper: createWrapper(),
    });

    expect(MockEventSource.instances).toHaveLength(0);
  });

  it("closes EventSource on unmount", () => {
    const { unmount } = renderHook(() => useNotificationSSE(true), {
      wrapper: createWrapper(),
    });

    const instance = MockEventSource.instances[0];
    unmount();

    expect(instance.close).toHaveBeenCalled();
  });

  it("registers a notification event listener", () => {
    renderHook(() => useNotificationSSE(true), {
      wrapper: createWrapper(),
    });

    const instance = MockEventSource.instances[0];
    expect(instance.listeners.notification).toBeDefined();
  });
});
