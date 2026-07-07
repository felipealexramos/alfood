import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import http from "../../../http";
import IDish from "../../../interfaces/IDish";
import IRestaurant from "../../../interfaces/IRestaurant";
import ITag from "../../../interfaces/ITag";
import { createQueryWrapper } from "../../../test/queryWrapper";
import DishForm from "./DishForm";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("../../../http", () => ({
  default: { get: vi.fn(), request: vi.fn() },
  httpV1: { get: vi.fn() },
}));

const tags: ITag[] = [
  { id: 1, value: "Vegetarian" },
  { id: 2, value: "Dessert" },
];
const restaurants: IRestaurant[] = [
  { id: 1, nome: "Kalamos", pratos: [] },
  { id: 2, nome: "Lyllys", pratos: [] },
];
const dish: IDish = {
  id: 10,
  nome: "Stroganoff",
  descricao: "Mushroom stroganoff",
  tag: "Vegetarian",
  imagem: "http://localhost:8000/media/s.jpg",
  restaurante: 2,
};

const wireGet = () => {
  vi.mocked(http.get).mockImplementation((url: string) => {
    if (url === "tags/") return Promise.resolve({ data: { tags } });
    if (url === "restaurantes/") return Promise.resolve({ data: restaurants });
    if (url === "pratos/10/") return Promise.resolve({ data: dish });
    return Promise.reject(new Error(`unexpected GET ${url}`));
  });
};

const renderRoute = (route: string) => {
  const { wrapper } = createQueryWrapper();
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/admin/dishes/new" element={<DishForm />} />
        <Route path="/admin/dishes/:id" element={<DishForm />} />
      </Routes>
    </MemoryRouter>,
    { wrapper }
  );
};

const selectOption = async (
  user: ReturnType<typeof userEvent.setup>,
  comboboxName: RegExp,
  optionName: string
) => {
  await user.click(screen.getByRole("combobox", { name: comboboxName }));
  await user.click(await screen.findByRole("option", { name: optionName }));
};

describe("DishForm", () => {
  const requestMock = vi.mocked(http.request);

  beforeEach(() => {
    vi.mocked(http.get).mockReset();
    requestMock.mockReset();
    navigateMock.mockReset();
    wireGet();
  });

  it("shows validation errors and does not submit when required fields are empty", async () => {
    renderRoute("/admin/dishes/new");
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/tag is required/i)).toBeInTheDocument();
    expect(screen.getByText(/restaurant is required/i)).toBeInTheDocument();
    expect(requestMock).not.toHaveBeenCalled();
  });

  it("creates a dish, posting multipart form data with the pt-BR contract keys", async () => {
    requestMock.mockResolvedValueOnce({ data: {} });
    renderRoute("/admin/dishes/new");
    const user = userEvent.setup();

    await user.type(screen.getByRole("textbox", { name: /dish name/i }), "Feijoada");
    await user.type(
      screen.getByRole("textbox", { name: /dish description/i }),
      "Black bean stew"
    );
    await selectOption(user, /tag/i, "Vegetarian");
    await selectOption(user, /restaurant/i, "Kalamos");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(requestMock).toHaveBeenCalledTimes(1));
    const config = requestMock.mock.calls[0][0];
    expect(config.method).toBe("POST");
    expect(config.url).toBe("pratos/");
    const formData = config.data as FormData;
    expect(formData.get("nome")).toBe("Feijoada");
    expect(formData.get("descricao")).toBe("Black bean stew");
    expect(formData.get("tag")).toBe("Vegetarian");
    expect(formData.get("restaurante")).toBe("1");

    expect(await screen.findByText(/created successfully/i)).toBeInTheDocument();
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/admin/dishes"), {
      timeout: 3000,
    });
  });

  it("loads an existing dish and updates it with a PUT to pratos/:id/", async () => {
    requestMock.mockResolvedValueOnce({ data: {} });
    renderRoute("/admin/dishes/10");
    const user = userEvent.setup();

    expect(await screen.findByDisplayValue("Stroganoff")).toBeInTheDocument();
    expect(http.get).toHaveBeenCalledWith("pratos/10/");

    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(requestMock).toHaveBeenCalledTimes(1));
    const config = requestMock.mock.calls[0][0];
    expect(config.method).toBe("PUT");
    expect(config.url).toBe("pratos/10/");
    const formData = config.data as FormData;
    expect(formData.get("restaurante")).toBe("2");
  });

  it("rejects an unsupported image type", async () => {
    renderRoute("/admin/dishes/new");
    const user = userEvent.setup();

    const invalid = new File(["x"], "notes.txt", { type: "text/plain" });
    await user.upload(screen.getByLabelText(/dish image/i), invalid);
    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByText(/unsupported image type/i)).toBeInTheDocument();
    expect(requestMock).not.toHaveBeenCalled();
  });
});
