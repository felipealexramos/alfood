import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./http", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  httpV1: { get: vi.fn().mockResolvedValue({ data: { results: [], next: "" } }) },
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

describe("App routing", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("redirects an unauthenticated visitor from a protected route to the login page", () => {
    renderAt("/admin/restaurants");

    expect(
      screen.getByRole("heading", { name: /admin sign in/i })
    ).toBeInTheDocument();
  });

  it("renders the public home page at the root route", () => {
    renderAt("/");

    expect(
      screen.getByRole("heading", { name: /the best restaurant network/i })
    ).toBeInTheDocument();
  });
});
