import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

/**
 * Builds an isolated QueryClient plus a wrapper component for tests that render
 * hooks/components depending on React Query. Retries are disabled so failing
 * queries surface immediately instead of being retried.
 */
export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      // notifyOnChangeProps: "all" disables React Query's tracked-props
      // optimization so renderHook's result.current always reflects the latest
      // state (otherwise post-fetchNextPage updates can appear stale in tests).
      queries: { retry: false, notifyOnChangeProps: "all" },
      mutations: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, queryClient };
}
