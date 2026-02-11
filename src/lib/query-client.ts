import { type DefaultOptions, QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/shared/types/api";

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  },
  mutations: {
    retry: false,
  },
};

let browserQueryClient: QueryClient | undefined;

function makeQueryClient(): QueryClient {
  return new QueryClient({ defaultOptions: queryConfig });
}

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
