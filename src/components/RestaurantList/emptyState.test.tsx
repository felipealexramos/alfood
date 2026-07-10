import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useShowcaseRestaurants } from "../../hooks/useShowcaseRestaurants";
import RestaurantList from ".";

vi.mock("../../hooks/useShowcaseRestaurants", () => ({
  useShowcaseRestaurants: vi.fn(),
}));

describe("RestaurantList empty state", () => {
  it("falls back to an empty list when data is undefined but not loading or errored", () => {
    vi.mocked(useShowcaseRestaurants).mockReturnValue({
      data: undefined,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useShowcaseRestaurants>);

    render(<RestaurantList />);

    expect(
      screen.getByRole("heading", { name: /the coolest/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /load more/i })
    ).not.toBeInTheDocument();
  });
});
