import { afterEach, describe, expect, it, vi } from "vitest";

const importClients = async () => {
  vi.resetModules();
  return import("./index");
};

describe("http clients", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds the baseURLs from VITE_API_URL", async () => {
    vi.stubEnv("VITE_API_URL", "http://example.dev:9000");

    const { default: http, httpV1 } = await importClients();

    expect(http.defaults.baseURL).toBe("http://example.dev:9000/api/v2/");
    expect(httpV1.defaults.baseURL).toBe("http://example.dev:9000/api/v1/");
  });

  it("falls back to http://localhost:8000 when VITE_API_URL is not set", async () => {
    vi.stubEnv("VITE_API_URL", undefined);

    const { default: http, httpV1 } = await importClients();

    expect(http.defaults.baseURL).toBe("http://localhost:8000/api/v2/");
    expect(httpV1.defaults.baseURL).toBe("http://localhost:8000/api/v1/");
  });
});
