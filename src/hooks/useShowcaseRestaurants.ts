import { useInfiniteQuery } from "@tanstack/react-query";
import { httpV1 } from "../http";
import { IPagination } from "../interfaces/IPagination";
import IRestaurant from "../interfaces/IRestaurant";
import { queryKeys } from "./queryKeys";

const FIRST_PAGE = "restaurantes/";

/**
 * Public showcase listing (GET /api/v1/restaurantes/). Pagination follows the
 * absolute `next` URL from the DRF-style envelope; axios ignores the client
 * baseURL for absolute URLs, so `next` can be passed straight through.
 */
export function useShowcaseRestaurants() {
  return useInfiniteQuery({
    queryKey: queryKeys.showcaseRestaurants,
    queryFn: async ({ pageParam }) => {
      const { data } = await httpV1.get<IPagination<IRestaurant>>(pageParam);
      return data;
    },
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage) => lastPage.next || undefined,
  });
}
