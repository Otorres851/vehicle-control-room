export const TRACCAR_BASE_URL = import.meta.env.VITE_TRACCAR_BASE_URL;

export const ENDPOINTS = {
  session: "/api/session",
  devices: "/api/devices",
  positions: "/api/positions",
} as const;
