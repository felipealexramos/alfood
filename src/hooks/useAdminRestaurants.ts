import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../http";
import IRestaurant from "../interfaces/IRestaurant";
import { queryKeys } from "./queryKeys";

/** Loads the admin restaurant list (GET /api/v2/restaurantes/). */
export function useAdminRestaurants() {
  return useQuery({
    queryKey: queryKeys.adminRestaurants,
    queryFn: async () => {
      const { data } = await http.get<IRestaurant[]>("restaurantes/");
      return data;
    },
  });
}

/** Deletes a restaurant and refreshes the admin restaurant list. */
export function useDeleteRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await http.delete(`restaurantes/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminRestaurants });
    },
  });
}
