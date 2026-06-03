const KNOT_TO_KMH = 1.852;

export function formatSpeedFromKnots(speedInKnots?: number) {
  if (typeof speedInKnots !== "number") return "—";

  // Traccar reports speed in knots. Operators read speed more naturally in km/h.
  return `${Math.round(speedInKnots * KNOT_TO_KMH)} km/h`;
}

export function formatTime(value?: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

export function formatConnectionStatus(status?: string) {
  if (!status) return "unknown";

  return status;
}
