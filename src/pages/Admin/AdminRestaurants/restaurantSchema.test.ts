import { describe, expect, it } from "vitest";
import { restaurantSchema } from "./restaurantSchema";

describe("restaurantSchema", () => {
  it("accepts a non-empty name", () => {
    const result = restaurantSchema.safeParse({ nome: "Kalamos" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty or whitespace-only name", () => {
    expect(restaurantSchema.safeParse({ nome: "" }).success).toBe(false);
    expect(restaurantSchema.safeParse({ nome: "   " }).success).toBe(false);
  });
});
