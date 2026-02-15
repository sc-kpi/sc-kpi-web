import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

let featureFlagApi: typeof import("../index");

beforeEach(async () => {
  vi.resetModules();
  featureFlagApi = await import("../index");
  fetchMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("feature-flags API client", () => {
  it("getFeatureFlags calls correct endpoint with GET", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ "flag.a": true }));

    const result = await featureFlagApi.getFeatureFlags();

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/v1/feature-flags");
    expect(init.method).toBe("GET");
    expect(result).toEqual({ "flag.a": true });
  });

  it("getAdminFeatureFlags passes page params", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ content: [], totalPages: 0 }));

    await featureFlagApi.getAdminFeatureFlags(1, 10);

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/v1/admin/feature-flags");
    expect(url).toContain("page=1");
    expect(url).toContain("size=10");
  });

  it("getAdminFeatureFlag calls correct URL with id", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: "abc", key: "test.flag" }));

    await featureFlagApi.getAdminFeatureFlag("abc");

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/v1/admin/feature-flags/abc");
  });

  it("createFeatureFlag sends POST with request body", async () => {
    const requestBody = {
      key: "new.flag",
      name: "New Flag",
      description: "desc",
      enabled: true,
      environment: "",
      rolloutPercentage: 100,
    };
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: "new", ...requestBody }));

    await featureFlagApi.createFeatureFlag(requestBody);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/v1/admin/feature-flags");
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify(requestBody));
  });

  it("updateFeatureFlag sends PATCH with id and body", async () => {
    const updateBody = { name: "Updated" };
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: "abc", key: "test.flag", name: "Updated" }));

    await featureFlagApi.updateFeatureFlag("abc", updateBody);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/v1/admin/feature-flags/abc");
    expect(init.method).toBe("PATCH");
    expect(init.body).toBe(JSON.stringify(updateBody));
  });

  it("toggleFeatureFlag sends PATCH to toggle endpoint", async () => {
    const toggleBody = { enabled: false, reason: "test" };
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: "abc", enabled: false }));

    await featureFlagApi.toggleFeatureFlag("abc", toggleBody);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/v1/admin/feature-flags/abc/toggle");
    expect(init.method).toBe("PATCH");
  });

  it("deleteFeatureFlag sends DELETE to correct URL", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    await featureFlagApi.deleteFeatureFlag("abc");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/v1/admin/feature-flags/abc");
    expect(init.method).toBe("DELETE");
  });

  it("addOverride sends POST to overrides endpoint", async () => {
    const overrideBody = { overrideType: "TIER" as const, tierLevel: 5, enabled: false };
    fetchMock.mockResolvedValueOnce(jsonResponse({ id: "ovr-1", ...overrideBody }));

    await featureFlagApi.addOverride("abc", overrideBody);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/v1/admin/feature-flags/abc/overrides");
    expect(init.method).toBe("POST");
  });

  it("removeOverride sends DELETE to override URL", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));

    await featureFlagApi.removeOverride("abc", "ovr-1");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/v1/admin/feature-flags/abc/overrides/ovr-1");
    expect(init.method).toBe("DELETE");
  });
});
