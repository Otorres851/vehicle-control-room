import { useQuery } from "@tanstack/react-query";

import { createSession } from "../../../api/traccar.api";

export function useTraccarSession() {
  return useQuery({
    queryKey: ["traccar-session"],

    // Creates the required Traccar session cookie before requesting protected data.
    queryFn: createSession,

    retry: 1,
  });
}
