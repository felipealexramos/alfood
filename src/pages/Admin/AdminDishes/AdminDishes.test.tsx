import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import IDish from "../../../interfaces/IDish";
import http from "../../../http";
import { createQueryWrapper } from "../../../test/queryWrapper";
import AdminDishes from "./AdminDishes";

vi.mock("../../../http", () => ({
  default: { get: vi.fn(), delete: vi.fn() },
  httpV1: { get: vi.fn() },
}));

const dish = (id: number, nome: string): IDish => ({
  id,
  nome,
  descricao: `${nome} description`,
  tag: "Main",
  imagem: `http://localhost:8000/media/${id}.jpg`,
  restaurante: 1,
});

const dishes: IDish[] = [dish(10, "Stroganoff"), dish(11, "Feijoada")];

const renderAdmin = () => {
  const { wrapper } = createQueryWrapper();
  return render(
    <MemoryRouter>
      <AdminDishes />
    </MemoryRouter>,
    { wrapper }
  );
};

describe("AdminDishes", () => {
  const getMock = vi.mocked(http.get);
  const deleteMock = vi.mocked(http.delete);

  beforeEach(() => {
    getMock.mockReset();
    deleteMock.mockReset();
  });

  it("lists the dishes returned by the query", async () => {
    getMock.mockResolvedValue({ data: dishes });

    renderAdmin();

    expect(await screen.findByText("Stroganoff")).toBeInTheDocument();
    expect(screen.getByText("Feijoada")).toBeInTheDocument();
  });

  it("deletes a dish and removes its row after cache invalidation", async () => {
    getMock
      .mockResolvedValueOnce({ data: dishes })
      .mockResolvedValueOnce({ data: [dishes[1]] });
    deleteMock.mockResolvedValueOnce({ data: {} });

    renderAdmin();
    const user = userEvent.setup();

    const row = (await screen.findByText("Stroganoff")).closest("tr")!;
    await user.click(within(row).getByRole("button", { name: /delete/i }));

    expect(deleteMock).toHaveBeenCalledWith("pratos/10/");
    await waitFor(() =>
      expect(screen.queryByText("Stroganoff")).not.toBeInTheDocument()
    );
    expect(screen.getByText("Feijoada")).toBeInTheDocument();
  });

  it("shows an error message when loading fails", async () => {
    getMock.mockRejectedValueOnce(new Error("boom"));

    renderAdmin();

    expect(await screen.findByText(/could not load dishes/i)).toBeInTheDocument();
  });
});
