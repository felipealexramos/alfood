import { z } from "zod";

/** Mirrors the backend Multer config (pratos/upload.config.ts): 5MB, image MIME allowlist. */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Field names (nome/descricao/tag/restaurante/imagem) are the backend contract — do not translate.
export const dishSchema = z.object({
  nome: z.string().trim().min(1, "Name is required"),
  descricao: z.string().trim().min(1, "Description is required"),
  tag: z.string().min(1, "Tag is required"),
  restaurante: z.string().min(1, "Restaurant is required"),
  imagem: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_IMAGE_SIZE, "Image must be 5MB or smaller")
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
      "Unsupported image type"
    )
    .optional(),
});

export type DishFormValues = z.infer<typeof dishSchema>;
