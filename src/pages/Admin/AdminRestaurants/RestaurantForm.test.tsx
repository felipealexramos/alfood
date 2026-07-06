import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosResponse } from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import IRestaurant from "../../../interfaces/IRestaurant";
import http from "../../../http";
import RestaurantForm from "./RestaurantForm";

vi.mock("../../../http", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn() },
  httpV1: { get: vi.fn() },
}));

const restaurantResponse = (
  restaurant: IRestaurant
): AxiosResponse<IRestaurant> =>
  ({ data: restaurant } as AxiosResponse<IRestaurant>);

const renderRoute = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/admin/restaurants/new" element={<RestaurantForm />} />
        <Route path="/admin/restaurants/:id" element={<RestaurantForm />} />
      </Routes>
    </MemoryRouter>
  );

describe("RestaurantForm", () => {
  const getMock = vi.mocked(http.get);
  const postMock = vi.mocked(http.post);
  const putMock = vi.mocked(http.put);

  beforeEach(() => {
    getMock.mockReset();
    postMock.mockReset();
    putMock.mockReset();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("creates a restaurant with a POST to a path relative to the http client", async () => {
    postMock.mockResolvedValueOnce(
      restaurantResponse({ id: 1, nome: "Burger Square", pratos: [] })
    );
    renderRoute("/admin/restaurants/new");
    const user = userEvent.setup();

    await user.type(
      screen.getByRole("textbox", { name: /restaurant name/i }),
      "Burger Square"
    );
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(postMock).toHaveBeenCalledWith("restaurantes/", {
      nome: "Burger Square",
    });
    expect(getMock).not.toHaveBeenCalled();
  });

  it("loads and updates an existing restaurant using relative paths", async () => {
    getMock.mockResolvedValueOnce(
      restaurantResponse({ id: 2, nome: "Bistro", pratos: [] })
    );
    putMock.mockResolvedValueOnce(
      restaurantResponse({ id: 2, nome: "Bistro Square", pratos: [] })
    );
    renderRoute("/admin/restaurants/2");
    const user = userEvent.setup();

    const nameField = screen.getByRole("textbox", {
      name: /restaurant name/i,
    });
    expect(await screen.findByDisplayValue("Bistro")).toBeInTheDocument();
    expect(getMock).toHaveBeenCalledWith("restaurantes/2/");

    await user.clear(nameField);
    await user.type(nameField, "Bistro Square");
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(putMock).toHaveBeenCalledWith("restaurantes/2/", {
      nome: "Bistro Square",
    });
  });
});
