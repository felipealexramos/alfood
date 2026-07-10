import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IPagination } from "../../interfaces/IPagination";
import IRestaurant from "../../interfaces/IRestaurant";
import { httpV1 } from "../../http";
import { createQueryWrapper } from "../../test/queryWrapper";
import RestaurantShowcase from ".";

vi.mock("../../http", () => ({
  default: { get: vi.fn() },
  httpV1: { get: vi.fn() },
}));

const lyllys: IRestaurant = { id: 1, nome: "Lyllys Cafe", pratos: [] };

const page = (
  restaurants: IRestaurant[]
): { data: IPagination<IRestaurant> } => ({
  data: { count: restaurants.length, next: "", previous: "", results: restaurants },
});

const renderShowcase = () => {
  const { wrapper } = createQueryWrapper();
  return render(
    <MemoryRouter>
      <RestaurantShowcase />
    </MemoryRouter>,
    { wrapper }
  );
};

describe("RestaurantShowcase", () => {
  const getMock = vi.mocked(httpV1.get);

  beforeEach(() => {
    getMock.mockReset();
  });

  it("renders the public navigation", () => {
    getMock.mockResolvedValueOnce(page([]));

    renderShowcase();

    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: /restaurants/i })).toHaveAttribute(
      "href",
      "/restaurants"
    );
  });

  it("mounts the restaurant list and shows the fetched restaurants", async () => {
    getMock.mockResolvedValueOnce(page([lyllys]));

    renderShowcase();

    expect(await screen.findByText("Lyllys Cafe")).toBeInTheDocument();
    expect(getMock).toHaveBeenCalledWith("restaurantes/");
  });
});
