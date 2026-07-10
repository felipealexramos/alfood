import type { InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import http from "./index";
import { getToken, setToken } from "../auth/session";

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

    const { default: httpInstance, httpV1 } = await importClients();

    expect(httpInstance.defaults.baseURL).toBe("http://example.dev:9000/api/v2/");
    expect(httpV1.defaults.baseURL).toBe("http://example.dev:9000/api/v1/");
  });

  it("falls back to http://localhost:8000 when VITE_API_URL is not set", async () => {
    vi.stubEnv("VITE_API_URL", undefined);

    const { default: httpInstance, httpV1 } = await importClients();

    expect(httpInstance.defaults.baseURL).toBe("http://localhost:8000/api/v2/");
    expect(httpV1.defaults.baseURL).toBe("http://localhost:8000/api/v1/");
  });
});

describe("http auth interceptors", () => {
  let capturedConfig: InternalAxiosRequestConfig | undefined;

  beforeEach(() => {
    localStorage.clear();
    capturedConfig = undefined;
    // Fake adapter so requests never hit the network; it captures the final config.
    http.defaults.adapter = async (config) => {
      capturedConfig = config;
      return {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("injects the Authorization header when a token is stored", async () => {
    setToken("jwt-abc");

    await http.get("restaurantes/");

    expect(capturedConfig?.headers.Authorization).toBe("Bearer jwt-abc");
  });

  it("does not set the Authorization header when there is no token", async () => {
    await http.get("restaurantes/");

    expect(capturedConfig?.headers.Authorization).toBeUndefined();
  });

  it("clears the token and redirects to the login page on a 401 response", async () => {
    setToken("jwt-abc");
    const originalLocation = window.location;
    const assignMock = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, pathname: "/", assign: assignMock },
    });
    http.defaults.adapter = async () =>
      Promise.reject({ response: { status: 401 } });

    await expect(http.get("restaurantes/")).rejects.toBeDefined();

    expect(getToken()).toBeNull();
    expect(assignMock).toHaveBeenCalledWith("/admin/login");

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("keeps the token and does not redirect on a non-401 error", async () => {
    setToken("jwt-abc");
    const originalLocation = window.location;
    const assignMock = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, pathname: "/", assign: assignMock },
    });
    http.defaults.adapter = async () =>
      Promise.reject({ response: { status: 500 } });

    await expect(http.get("restaurantes/")).rejects.toBeDefined();

    expect(getToken()).toBe("jwt-abc");
    expect(assignMock).not.toHaveBeenCalled();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("keeps the token and does not redirect on a network error without a response", async () => {
    setToken("jwt-abc");
    const originalLocation = window.location;
    const assignMock = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, pathname: "/", assign: assignMock },
    });
    http.defaults.adapter = async () => Promise.reject({ message: "Network Error" });

    await expect(http.get("restaurantes/")).rejects.toBeDefined();

    expect(getToken()).toBe("jwt-abc");
    expect(assignMock).not.toHaveBeenCalled();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("clears the token but does not redirect when a 401 hits while already on the login page", async () => {
    setToken("jwt-abc");
    const originalLocation = window.location;
    const assignMock = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, pathname: "/admin/login", assign: assignMock },
    });
    http.defaults.adapter = async () =>
      Promise.reject({ response: { status: 401 } });

    await expect(http.get("restaurantes/")).rejects.toBeDefined();

    expect(getToken()).toBeNull();
    expect(assignMock).not.toHaveBeenCalled();

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });
});
