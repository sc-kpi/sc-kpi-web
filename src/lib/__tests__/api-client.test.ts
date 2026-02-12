import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

// Dynamic import to ensure fetch is mocked before module loads
let api: typeof import("../api-client").api;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import("../api-client");
  api = mod.api;
  fetchMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function jsonResponse(body: unknown, status = 200, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

describe("api-client", () => {
  it("makes GET request with correct URL and credentials", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: "1" }));

    const result = await api.get("/api/v1/test");

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/v1/test");
    expect(init.method).toBe("GET");
    expect(init.credentials).toBe("include");
    expect(result).toEqual({ id: "1" });
  });

  it("makes POST request with JSON body", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

    await api.post("/api/v1/test", { foo: "bar" });

    const [, init] = fetchMock.mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ foo: "bar" }));
  });

  it("throws ApiError on non-ok JSON response", async () => {
    const problem = {
      type: "about:blank",
      title: "Unauthorized",
      status: 401,
      detail: "Invalid credentials",
    };
    // First call returns 401, refresh also fails
    fetchMock
      .mockResolvedValueOnce(jsonResponse(problem, 401))
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(jsonResponse(problem, 401));

    try {
      await api.post("/api/v1/auth/login", {});
      expect.unreachable("Should have thrown");
    } catch (e: unknown) {
      expect((e as Error).name).toBe("ApiError");
      expect((e as { status: number }).status).toBe(401);
      expect((e as { detail: string }).detail).toBe("Invalid credentials");
    }
  });

  it("auto-refreshes on 401 and retries", async () => {
    // First request: 401
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ type: "about:blank", title: "Unauthorized", status: 401 }, 401),
    );
    // Refresh: success
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));
    // Retry: success
    fetchMock.mockResolvedValueOnce(jsonResponse({ data: "success" }));

    const result = await api.get("/api/v1/protected");

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ data: "success" });
  });

  it("returns undefined for 204 No Content", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    const result = await api.delete("/api/v1/test");

    expect(result).toBeUndefined();
  });

  it("throws ApiError with statusText for non-JSON errors", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("Internal Server Error", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      }),
    );

    try {
      await api.get("/api/v1/test");
      expect.unreachable("Should have thrown");
    } catch (e: unknown) {
      expect((e as Error).name).toBe("ApiError");
      expect((e as { status: number }).status).toBe(500);
    }
  });
});
