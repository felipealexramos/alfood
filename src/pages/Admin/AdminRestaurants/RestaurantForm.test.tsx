import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import http from "../../../http";
import { createQueryWrapper } from "../../../test/queryWrapper";
import RestaurantForm from "./RestaurantForm";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("../../../http", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
  httpV1: { get: vi.fn() },
}));

const renderRoute = (route: string) => {
  const { wrapper } = createQueryWrapper();
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/admin/restaurants/new" element={<RestaurantForm />} />
        <Route path="/admin/restaurants/:id" element={<RestaurantForm />} />
      </Routes>
    </MemoryRouter>,
    { wrapper }
  );
};

describe("RestaurantForm", () => {
  const getMock = vi.mocked(http.get);
  const postMock = vi.mocked(http.post);
  const putMock = vi.mocked(http.put);

  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
    putMock.mockReset();
    navigateMock.mockReset();
  });

  it("shows a validation error and does not submit when the name is empty", async () => {
    renderRoute("/admin/restaurants/new");
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(postMock).not.toHaveBeenCalled();
  });

  it("creates a restaurant, shows a success message and returns to the list", async () => {
    postMock.mockResolvedValueOnce({ data: { id: 1, nome: "Burger Square", pratos: [] } });
    renderRoute("/admin/restaurants/new");
    const user = userEvent.setup();

    await user.type(
      screen.getByRole("textbox", { name: /restaurant name/i }),
      "Burger Square"
    );
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(postMock).toHaveBeenCalledWith("restaurantes/", { nome: "Burger Square" })
    );
    expect(await screen.findByText(/created successfully/i)).toBeInTheDocument();
    await waitFor(
      () => expect(navigateMock).toHaveBeenCalledWith("/admin/restaurants"),
      { timeout: 3000 }
    );
  });

  it("loads an existing restaurant and updates it with PUT", async () => {
    getMock.mockResolvedValueOnce({ data: { id: 2, nome: "Bistro", pratos: [] } });
    putMock.mockResolvedValueOnce({ data: { id: 2, nome: "Bistro Square", pratos: [] } });
    renderRoute("/admin/restaurants/2");
    const user = userEvent.setup();

    expect(await screen.findByDisplayValue("Bistro")).toBeInTheDocument();
    expect(getMock).toHaveBeenCalledWith("restaurantes/2/");

    const nameField = screen.getByRole("textbox", { name: /restaurant name/i });
    await user.clear(nameField);
    await user.type(nameField, "Bistro Square");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(putMock).toHaveBeenCalledWith("restaurantes/2/", { nome: "Bistro Square" })
    );
  });
});
