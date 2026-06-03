import { useQuery } from "@tanstack/react-query";

import { getPositions } from "../../../api/traccar.api";

export function usePositions(isEnabled: boolean) {
  return useQuery({
    queryKey: ["traccar-positions"],
    queryFn: getPositions,
    enabled: isEnabled,

    // Polling keeps the monitor close to real time without requiring WebSockets.
    refetchInterval: 5_000,
  });
}
