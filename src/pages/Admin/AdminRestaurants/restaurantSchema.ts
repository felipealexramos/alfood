import { z } from "zod";

// `nome` is the backend contract field name (pt-BR) — do not translate it.
export const restaurantSchema = z.object({
  nome: z.string().trim().min(1, "Name is required"),
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;
