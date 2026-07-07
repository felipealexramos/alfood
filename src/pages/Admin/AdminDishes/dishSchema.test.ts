import { describe, expect, it } from "vitest";
import { dishSchema, MAX_IMAGE_SIZE } from "./dishSchema";

const validFields = {
  nome: "Stroganoff",
  descricao: "Mushroom stroganoff",
  tag: "Vegetarian",
  restaurante: "1",
};

const imageFile = (type: string, size: number): File => {
  const file = new File([new Uint8Array(1)], "image", { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

describe("dishSchema", () => {
  it("accepts all required fields without an image (image is optional)", () => {
    const result = dishSchema.safeParse(validFields);
    expect(result.success).toBe(true);
  });

  it("accepts a valid image within the size and MIME limits", () => {
    const result = dishSchema.safeParse({
      ...validFields,
      imagem: imageFile("image/png", 1024),
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required text fields and selects", () => {
    const result = dishSchema.safeParse({
      nome: "",
      descricao: "",
      tag: "",
      restaurante: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an image larger than 5MB", () => {
    const result = dishSchema.safeParse({
      ...validFields,
      imagem: imageFile("image/png", MAX_IMAGE_SIZE + 1),
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unsupported image MIME type", () => {
    const result = dishSchema.safeParse({
      ...validFields,
      imagem: imageFile("text/plain", 1024),
    });
    expect(result.success).toBe(false);
  });
});
