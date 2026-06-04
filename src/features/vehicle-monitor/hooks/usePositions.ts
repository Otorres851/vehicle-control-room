import { useQuery } from "@tanstack/react-query";

import { getPositions } from "../../../api/traccar.api";

export function usePositions(isEnabled: boolean) {
  return useQuery({
    queryKey: ["traccar-positions"],
    queryFn: getPositions,
    enabled: isEnabled,

    // Poll aggressively enough to feel real-time.
    refetchInterval: 3_000,
    refetchIntervalInBackground: true,

    staleTime: 0,
    gcTime: 0,
  });
}
