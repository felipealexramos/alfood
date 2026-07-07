import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../http";
import IDish from "../interfaces/IDish";
import { DishFormValues } from "../pages/Admin/AdminDishes/dishSchema";
import { queryKeys } from "./queryKeys";

/** Loads the admin dish list (GET /api/v2/pratos/). */
export function useAdminDishes() {
  return useQuery({
    queryKey: queryKeys.adminDishes,
    queryFn: async () => {
      const { data } = await http.get<IDish[]>("pratos/");
      return data;
    },
  });
}

/** Loads a single dish for the edit form (GET /api/v2/pratos/:id/). */
export function useDish(id?: string) {
  return useQuery({
    queryKey: queryKeys.dish(id ?? ""),
    queryFn: async () => {
      const { data } = await http.get<IDish>(`pratos/${id}/`);
      return data;
    },
    enabled: Boolean(id),
  });
}

/**
 * Creates (POST) or updates (PUT when id is present) a dish. Posts
 * multipart/form-data with the pt-BR contract keys; the image is only appended
 * when a new file was picked, so an update without a new image keeps the
 * existing one on the backend.
 */
export function useSaveDish(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: DishFormValues) => {
      const formData = new FormData();
      formData.append("nome", values.nome);
      formData.append("descricao", values.descricao);
      formData.append("tag", values.tag);
      formData.append("restaurante", values.restaurante);
      if (values.imagem) {
        formData.append("imagem", values.imagem);
      }

      await http.request({
        url: id ? `pratos/${id}/` : "pratos/",
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDishes });
    },
  });
}

/** Deletes a dish and refreshes the admin dish list. */
export function useDeleteDish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await http.delete(`pratos/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminDishes });
    },
  });
}
