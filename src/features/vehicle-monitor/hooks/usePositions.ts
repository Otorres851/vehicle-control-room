import { useQuery } from "@tanstack/react-query";

import { getPositions } from "../../../api/traccar.api";

export function usePositions(isEnabled: boolean) {
  return useQuery({
    queryKey: ["traccar-positions"],
    queryFn: getPositions,
    enabled: isEnabled,

    // Polling keeps the dashboard synchronized without requiring WebSocket support.
    refetchInterval: 5_000,
  });
}
