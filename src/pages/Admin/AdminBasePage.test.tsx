import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setToken, getToken } from "../../auth/session";
import AdminBasePage from "./AdminBasePage";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

describe("AdminBasePage", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    localStorage.clear();
  });

  it("logs out: clears the token and redirects to the login page", async () => {
    setToken("jwt-123");
    render(
      <MemoryRouter>
        <AdminBasePage />
      </MemoryRouter>
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /log out/i }));

    expect(getToken()).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith("/admin/login");
  });
});
