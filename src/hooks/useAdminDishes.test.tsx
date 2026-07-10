import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import http from "../http";
import IDish from "../interfaces/IDish";
import { createQueryWrapper } from "../test/queryWrapper";
import { queryKeys } from "./queryKeys";
import { useAdminDishes, useDeleteDish, useSaveDish } from "./useAdminDishes";

vi.mock("../http", () => ({
  default: { get: vi.fn(), delete: vi.fn(), request: vi.fn() },
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
  const requestMock = vi.mocked(http.request);

  beforeEach(() => {
    getMock.mockReset();
    deleteMock.mockReset();
    requestMock.mockReset();
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

  it("appends the image to the form data when a new file was picked", async () => {
    requestMock.mockResolvedValueOnce({ data: {} });
    const image = new File(["binary"], "dish.jpg", { type: "image/jpeg" });
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useSaveDish(), { wrapper });
    await result.current.mutateAsync({
      nome: "Stroganoff",
      descricao: "Mushroom stroganoff",
      tag: "Vegetarian",
      restaurante: "1",
      imagem: image,
    });

    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: "pratos/", method: "POST" })
    );
    const formData = requestMock.mock.calls[0][0].data as FormData;
    expect(formData.get("imagem")).toBe(image);
  });
});
