import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import http from "../http";
import ITag from "../interfaces/ITag";
import { createQueryWrapper } from "../test/queryWrapper";
import { useTags } from "./useTags";

vi.mock("../http", () => ({
  default: { get: vi.fn() },
  httpV1: { get: vi.fn() },
}));

const tags: ITag[] = [
  { id: 1, value: "Vegetarian" },
  { id: 2, value: "Dessert" },
];

describe("useTags", () => {
  const getMock = vi.mocked(http.get);

  beforeEach(() => {
    getMock.mockReset();
  });

  it("fetches tags and unwraps the { tags } envelope", async () => {
    getMock.mockResolvedValueOnce({ data: { tags } });
    const { wrapper } = createQueryWrapper();

    const { result } = renderHook(() => useTags(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getMock).toHaveBeenCalledWith("tags/");
    expect(result.current.data).toEqual(tags);
  });
});
