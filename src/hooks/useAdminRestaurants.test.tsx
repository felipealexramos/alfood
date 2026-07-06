import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import http from "../http";
import IRestaurant from "../interfaces/IRestaurant";
import { createQueryWrapper } from "../test/queryWrapper";
import { queryKeys } from "./queryKeys";
import { useAdminRestaurants, useDeleteRestaurant } from "./useAdminRestaurants";

vi.mock("../http", () => ({
  default: { get: vi.fn(), delete: vi.fn() },
  httpV1: { get: vi.fn() },
}));

const restaurants: IRestaurant[] = [
  { id: 1, nome: "Kalamos", pratos: [] },
  { id: 2, nome: "Lyllys", pratos: [] },
];

describe("useAdminRestaurants", () => {
  const getMock = vi.mocked(http.get);
  const deleteMock = vi.mocked(http.delete);

  beforeEach(() => {
    getMock.mockReset();
    deleteMock.mockReset();
  });

  it("fetches the admin restaurant list from restaurantes/", async () => {
    getMock.mockResolvedValueOnce({ data: restaurants });
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useAdminRestaurants(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getMock).toHaveBeenCalledWith("restaurantes/");
    expect(result.current.data).toEqual(restaurants);
  });

  it("deletes a restaurant and invalidates the admin restaurants cache", async () => {
    deleteMock.mockResolvedValueOnce({ data: {} });
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteRestaurant(), { wrapper });
    await result.current.mutateAsync(2);

    expect(deleteMock).toHaveBeenCalledWith("restaurantes/2/");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.adminRestaurants,
    });
  });
});
