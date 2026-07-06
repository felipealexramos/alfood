import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { setToken } from "../../auth/session";
import ProtectedRoute from ".";

const renderGuarded = () =>
  render(
    <MemoryRouter initialEntries={["/admin/restaurants"]}>
      <Routes>
        <Route path="/admin/login" element={<div>Login Screen</div>} />
        <Route
          path="/admin/restaurants"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe("ProtectedRoute", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("redirects to /admin/login when there is no token", () => {
    renderGuarded();

    expect(screen.getByText("Login Screen")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders the protected content when a token is present", () => {
    setToken("jwt-123");

    renderGuarded();

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(screen.queryByText("Login Screen")).not.toBeInTheDocument();
  });
});
