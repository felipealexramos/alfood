import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosResponse } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IPagination } from "../../interfaces/IPagination";
import IRestaurant from "../../interfaces/IRestaurant";
import { httpV1 } from "../../http";
import RestaurantList from ".";

vi.mock("../../http", () => ({
  default: { get: vi.fn() },
  httpV1: { get: vi.fn() },
}));

const pageResponse = (
  restaurants: IRestaurant[],
  next = ""
): AxiosResponse<IPagination<IRestaurant>> =>
  ({
    data: {
      count: restaurants.length,
      next,
      previous: "",
      results: restaurants,
    },
  } as AxiosResponse<IPagination<IRestaurant>>);

const lyllys: IRestaurant = {
  id: 1,
  nome: "Lyllys Cafe",
  pratos: [
    {
      id: 10,
      nome: "Mushroom Stroganoff",
      descricao: "Creamy mushroom stroganoff",
      tag: "Vegetarian",
      imagem: "http://localhost:8000/media/stroganoff.jpg",
      restaurante: 1,
    },
  ],
};

const kalamos: IRestaurant = { id: 2, nome: "Kalamos", pratos: [] };

describe("RestaurantList", () => {
  const getMock = vi.mocked(httpV1.get);

  beforeEach(() => {
    getMock.mockReset();
  });

  it("fetches the first page through the httpV1 client and renders restaurants with their nested dishes", async () => {
    getMock.mockResolvedValueOnce(pageResponse([lyllys]));

    render(<RestaurantList />);

    expect(await screen.findByText("Lyllys Cafe")).toBeInTheDocument();
    expect(await screen.findByText("Mushroom Stroganoff")).toBeInTheDocument();
    expect(getMock).toHaveBeenCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith("restaurantes/");
  });

  it('follows the "next" URL through the httpV1 client when clicking "Load more"', async () => {
    const nextPageUrl = "http://localhost:8000/api/v1/restaurantes/?page=2";
    getMock
      .mockResolvedValueOnce(pageResponse([lyllys], nextPageUrl))
      .mockResolvedValueOnce(pageResponse([kalamos]));

    render(<RestaurantList />);
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button", { name: /load more/i }));

    expect(await screen.findByText("Kalamos")).toBeInTheDocument();
    expect(screen.getByText("Lyllys Cafe")).toBeInTheDocument();
    expect(getMock).toHaveBeenLastCalledWith(nextPageUrl);
    expect(
      screen.queryByRole("button", { name: /load more/i })
    ).not.toBeInTheDocument();
  });
});
