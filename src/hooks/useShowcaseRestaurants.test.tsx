import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { httpV1 } from "../http";
import { IPagination } from "../interfaces/IPagination";
import IRestaurant from "../interfaces/IRestaurant";
import { createQueryWrapper } from "../test/queryWrapper";
import { useShowcaseRestaurants } from "./useShowcaseRestaurants";

vi.mock("../http", () => ({
  default: { get: vi.fn() },
  httpV1: { get: vi.fn() },
}));

const page = (
  restaurants: IRestaurant[],
  next = ""
): { data: IPagination<IRestaurant> } => ({
  data: { count: restaurants.length, next, previous: "", results: restaurants },
});

const kalamos: IRestaurant = { id: 1, nome: "Kalamos", pratos: [] };
const lyllys: IRestaurant = { id: 2, nome: "Lyllys", pratos: [] };

describe("useShowcaseRestaurants", () => {
  const getMock = vi.mocked(httpV1.get);

  beforeEach(() => {
    getMock.mockReset();
  });

  it("fetches the first page from restaurantes/ and exposes hasNextPage from next", async () => {
    getMock.mockResolvedValueOnce(page([kalamos], "http://api/v1/restaurantes/?page=2"));
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useShowcaseRestaurants(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getMock).toHaveBeenCalledWith("restaurantes/");
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.data?.pages[0].results).toEqual([kalamos]);
  });

  it("follows the absolute next URL and stops paginating when next is empty", async () => {
    const nextUrl = "http://api/v1/restaurantes/?page=2";
    getMock
      .mockResolvedValueOnce(page([kalamos], nextUrl))
      .mockResolvedValueOnce(page([lyllys], ""));
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useShowcaseRestaurants(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(getMock).toHaveBeenLastCalledWith(nextUrl);
    expect(result.current.hasNextPage).toBe(false);
  });
});
