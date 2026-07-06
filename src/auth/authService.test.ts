import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import http from "../http";
import { login } from "./authService";
import { getToken } from "./session";

vi.mock("../http", () => ({
  default: { post: vi.fn() },
  httpV1: { get: vi.fn() },
}));

describe("authService.login", () => {
  const postMock = vi.mocked(http.post);

  beforeEach(() => {
    postMock.mockReset();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("posts credentials to auth/login/ and stores the returned access_token", async () => {
    postMock.mockResolvedValueOnce({ data: { access_token: "jwt-abc" } });

    await login({ usuario: "admin", senha: "secret" });

    expect(postMock).toHaveBeenCalledWith("auth/login/", {
      usuario: "admin",
      senha: "secret",
    });
    expect(getToken()).toBe("jwt-abc");
  });

  it("propagates the error and stores no token when the request fails", async () => {
    postMock.mockRejectedValueOnce({ response: { status: 401 } });

    await expect(login({ usuario: "admin", senha: "wrong" })).rejects.toBeDefined();
    expect(getToken()).toBeNull();
  });
});
