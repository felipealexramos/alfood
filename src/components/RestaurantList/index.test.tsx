import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { IPagination } from "../../interfaces/IPagination";
import IRestaurant from "../../interfaces/IRestaurant";
import { httpV1 } from "../../http";
import { createQueryWrapper } from "../../test/queryWrapper";
import RestaurantList from ".";

vi.mock("../../http", () => ({
  default: { get: vi.fn() },
  httpV1: { get: vi.fn() },
}));

const page = (
  restaurants: IRestaurant[],
  next = ""
): { data: IPagination<IRestaurant> } => ({
  data: { count: restaurants.length, next, previous: "", results: restaurants },
});

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

const renderList = () => {
  const { wrapper } = createQueryWrapper();
  return render(<RestaurantList />, { wrapper });
};

describe("RestaurantList", () => {
  const getMock = vi.mocked(httpV1.get);

  beforeEach(() => {
    getMock.mockReset();
  });

  it("fetches the first page through httpV1 and renders restaurants with nested dishes", async () => {
    getMock.mockResolvedValueOnce(page([lyllys]));

    renderList();

    expect(await screen.findByText("Lyllys Cafe")).toBeInTheDocument();
    expect(screen.getByText("Mushroom Stroganoff")).toBeInTheDocument();
    expect(getMock).toHaveBeenCalledWith("restaurantes/");
  });

  it('follows the "next" URL when clicking "Load more" and hides the button on the last page', async () => {
    const nextPageUrl = "http://localhost:8000/api/v1/restaurantes/?page=2";
    getMock
      .mockResolvedValueOnce(page([lyllys], nextPageUrl))
      .mockResolvedValueOnce(page([kalamos]));

    renderList();
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button", { name: /load more/i }));

    expect(await screen.findByText("Kalamos")).toBeInTheDocument();
    expect(screen.getByText("Lyllys Cafe")).toBeInTheDocument();
    expect(getMock).toHaveBeenLastCalledWith(nextPageUrl);
    expect(
      screen.queryByRole("button", { name: /load more/i })
    ).not.toBeInTheDocument();
  });

  it("shows an error message when the request fails", async () => {
    getMock.mockRejectedValueOnce(new Error("network down"));

    renderList();

    expect(await screen.findByText(/could not load restaurants/i)).toBeInTheDocument();
  });
});
