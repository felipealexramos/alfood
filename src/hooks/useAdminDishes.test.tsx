import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import http from "../http";
import IDish from "../interfaces/IDish";
import { createQueryWrapper } from "../test/queryWrapper";
import { queryKeys } from "./queryKeys";
import { useAdminDishes, useDeleteDish } from "./useAdminDishes";

vi.mock("../http", () => ({
  default: { get: vi.fn(), delete: vi.fn() },
  httpV1: { get: vi.fn() },
}));

const dishes: IDish[] = [
  {
    id: 10,
    nome: "Stroganoff",
    descricao: "Mushroom stroganoff",
    tag: "Vegetarian",
    imagem: "http://localhost:8000/media/s.jpg",
    restaurante: 1,
  },
];

describe("useAdminDishes", () => {
  const getMock = vi.mocked(http.get);
  const deleteMock = vi.mocked(http.delete);

  beforeEach(() => {
    getMock.mockReset();
    deleteMock.mockReset();
  });

  it("fetches the admin dish list from pratos/", async () => {
    getMock.mockResolvedValueOnce({ data: dishes });
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useAdminDishes(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getMock).toHaveBeenCalledWith("pratos/");
    expect(result.current.data).toEqual(dishes);
  });

  it("deletes a dish and invalidates the admin dishes cache", async () => {
    deleteMock.mockResolvedValueOnce({ data: {} });
    const { wrapper, queryClient } = createQueryWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteDish(), { wrapper });
    await result.current.mutateAsync(10);

    expect(deleteMock).toHaveBeenCalledWith("pratos/10/");
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.adminDishes,
    });
  });
});
