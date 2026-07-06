import { afterEach, describe, expect, it } from "vitest";
import { clearToken, getToken, isAuthenticated, setToken } from "./session";

describe("session", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("returns null and is not authenticated when no token is stored", () => {
    expect(getToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it("stores, reads and reports authentication once a token is set", () => {
    setToken("jwt-123");

    expect(getToken()).toBe("jwt-123");
    expect(isAuthenticated()).toBe(true);
  });

  it("clears the stored token", () => {
    setToken("jwt-123");

    clearToken();

    expect(getToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});
