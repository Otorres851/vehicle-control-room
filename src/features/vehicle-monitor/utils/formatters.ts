const KNOT_TO_KMH = 1.852;
const MIN_VISIBLE_SPEED_KMH = 3;

export function formatSpeedFromKnots(speedInKnots?: number) {
  if (typeof speedInKnots !== "number") {
    return "—";
  }

  const speedKmh = speedInKnots * KNOT_TO_KMH;

  // GPS sensors can report tiny speed fluctuations while the vehicle is stationary.
  if (speedKmh < MIN_VISIBLE_SPEED_KMH) {
    return "0 km/h";
  }

  return `${Math.round(speedKmh)} km/h`;
}

export function formatTime(value?: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

import type { TFunction } from "i18next";

export function formatConnectionStatus(
  status: string | undefined,
  t: TFunction,
) {
  if (!status) return t("status.unknown");

  const statusKey = status.toLowerCase();

  return t(`status.${statusKey}`, {
    defaultValue: status,
  });
}
