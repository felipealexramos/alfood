import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "../http";
import IRestaurant from "../interfaces/IRestaurant";
import { RestaurantFormValues } from "../pages/Admin/AdminRestaurants/restaurantSchema";
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

/** Loads a single restaurant for the edit form (GET /api/v2/restaurantes/:id/). */
export function useRestaurant(id?: string) {
  return useQuery({
    queryKey: queryKeys.restaurant(id ?? ""),
    queryFn: async () => {
      const { data } = await http.get<IRestaurant>(`restaurantes/${id}/`);
      return data;
    },
    enabled: Boolean(id),
  });
}

/** Creates (POST) or updates (PUT when id is present) a restaurant. */
export function useSaveRestaurant(id?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: RestaurantFormValues) => {
      if (id) {
        await http.put(`restaurantes/${id}/`, values);
      } else {
        await http.post("restaurantes/", values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminRestaurants });
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
