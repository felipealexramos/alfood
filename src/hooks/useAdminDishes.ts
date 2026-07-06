import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../http";
import IDish from "../interfaces/IDish";
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
