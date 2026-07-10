import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Home from ".";

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

describe("Home", () => {
  it("renders the hero headline", () => {
    renderHome();

    expect(
      screen.getByRole("heading", { name: /the best restaurant network/i })
    ).toBeInTheDocument();
  });

  it("renders every dish category", () => {
    renderHome();

    ["Breakfast", "Lunch", "Dinner", "Desserts"].forEach((category) => {
      expect(
        screen.getByRole("heading", { name: category })
      ).toBeInTheDocument();
    });
  });

  it("links the call-to-action to the restaurants showcase", () => {
    renderHome();

    expect(
      screen.getByRole("link", { name: /see all restaurants/i })
    ).toHaveAttribute("href", "/restaurants");
  });
});
