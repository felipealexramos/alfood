import { useQuery } from "@tanstack/react-query";
import http from "../http";
import ITag from "../interfaces/ITag";
import { queryKeys } from "./queryKeys";

/** Loads dish tags (GET /api/v2/tags/), unwrapping the { tags } envelope. */
export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: async () => {
      const { data } = await http.get<{ tags: ITag[] }>("tags/");
      return data.tags;
    },
  });
}
