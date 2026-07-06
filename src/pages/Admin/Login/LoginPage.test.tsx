import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { login } from "../../../auth/authService";
import LoginPage from "./LoginPage";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("../../../auth/authService", () => ({
  login: vi.fn(),
}));

const renderLogin = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

describe("LoginPage", () => {
  const loginMock = vi.mocked(login);

  beforeEach(() => {
    loginMock.mockReset();
    navigateMock.mockReset();
  });

  it("submits the credentials and redirects to the admin area on success", async () => {
    loginMock.mockResolvedValueOnce(undefined);
    renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByRole("textbox", { name: /username/i }), "admin");
    await user.type(screen.getByLabelText(/password/i), "secret");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(loginMock).toHaveBeenCalledWith({ usuario: "admin", senha: "secret" });
    expect(navigateMock).toHaveBeenCalledWith("/admin/restaurants");
  });

  it("shows an error message and does not navigate when login fails", async () => {
    loginMock.mockRejectedValueOnce({ response: { status: 401 } });
    renderLogin();
    const user = userEvent.setup();

    await user.type(screen.getByRole("textbox", { name: /username/i }), "admin");
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
