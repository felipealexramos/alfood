/** Centralized React Query keys so queries and their invalidations stay in sync. */
export const queryKeys = {
  adminRestaurants: ["admin", "restaurants"] as const,
  adminDishes: ["admin", "dishes"] as const,
  tags: ["tags"] as const,
  showcaseRestaurants: ["showcase", "restaurants"] as const,
};
