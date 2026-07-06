import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import IRestaurant from "../../../interfaces/IRestaurant";
import http from "../../../http";
import { createQueryWrapper } from "../../../test/queryWrapper";
import AdminRestaurants from "./AdminRestaurants";

vi.mock("../../../http", () => ({
  default: { get: vi.fn(), delete: vi.fn() },
  httpV1: { get: vi.fn() },
}));

const restaurants: IRestaurant[] = [
  { id: 1, nome: "Kalamos", pratos: [] },
  { id: 2, nome: "Lyllys", pratos: [] },
];

const renderAdmin = () => {
  const { wrapper } = createQueryWrapper();
  return render(
    <MemoryRouter>
      <AdminRestaurants />
    </MemoryRouter>,
    { wrapper }
  );
};

describe("AdminRestaurants", () => {
  const getMock = vi.mocked(http.get);
  const deleteMock = vi.mocked(http.delete);

  beforeEach(() => {
    getMock.mockReset();
    deleteMock.mockReset();
  });

  it("lists the restaurants returned by the query", async () => {
    getMock.mockResolvedValue({ data: restaurants });

    renderAdmin();

    expect(await screen.findByText("Kalamos")).toBeInTheDocument();
    expect(screen.getByText("Lyllys")).toBeInTheDocument();
  });

  it("deletes a restaurant and removes its row after cache invalidation", async () => {
    getMock
      .mockResolvedValueOnce({ data: restaurants })
      .mockResolvedValueOnce({ data: [restaurants[1]] });
    deleteMock.mockResolvedValueOnce({ data: {} });

    renderAdmin();
    const user = userEvent.setup();

    const kalamosRow = (await screen.findByText("Kalamos")).closest("tr")!;
    await user.click(within(kalamosRow).getByRole("button", { name: /delete/i }));

    expect(deleteMock).toHaveBeenCalledWith("restaurantes/1/");
    await waitFor(() =>
      expect(screen.queryByText("Kalamos")).not.toBeInTheDocument()
    );
    expect(screen.getByText("Lyllys")).toBeInTheDocument();
  });

  it("shows an error message when loading fails", async () => {
    getMock.mockRejectedValueOnce(new Error("boom"));

    renderAdmin();

    expect(await screen.findByText(/could not load restaurants/i)).toBeInTheDocument();
  });
});
