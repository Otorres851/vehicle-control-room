import { useQuery } from "@tanstack/react-query";

import { getDevices } from "../../../api/traccar.api";

export function useDevices(isAuthenticated: boolean) {
  return useQuery({
    queryKey: ["traccar-devices"],
    queryFn: getDevices,

    // Prevents protected requests before the session is available.
    enabled: isAuthenticated,
  });
}
