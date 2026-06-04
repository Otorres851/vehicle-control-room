import { ENDPOINTS } from "./endpoints";
import { httpClient } from "./http-client";

export type TraccarSession = {
  id: number;
  name: string;
  email?: string;
};

export type TraccarDevice = {
  id: number;
  name: string;
  uniqueId: string;
  status: "online" | "offline" | "unknown";
  lastUpdate?: string;
  positionId?: number;
};

export type TraccarPosition = {
  id: number;
  deviceId: number;
  latitude: number;
  longitude: number;
  speed: number;
  course: number;
  fixTime: string;
  deviceTime: string;
  serverTime: string;
  accuracy?: number;
  altitude?: number;
  address?: string | null;
  valid?: boolean;
  attributes?: Record<string, unknown>;
};

// Traccar creates a session cookie after successful authentication.
export async function createSession() {
  const body = new URLSearchParams({
    email: import.meta.env.VITE_TRACCAR_EMAIL,
    password: import.meta.env.VITE_TRACCAR_PASSWORD,
  });

  const response = await httpClient.post<TraccarSession>(
    ENDPOINTS.session,
    body,
  );

  return response.data;
}

// Retrieves the fleet devices available to the authenticated operator.
export async function getDevices() {
  const response = await httpClient.get<TraccarDevice[]>(ENDPOINTS.devices);

  return response.data;
}

// Retrieves the latest known positions for all tracked devices.
export async function getPositions() {
  const response = await httpClient.get<TraccarPosition[]>(ENDPOINTS.positions);

  return response.data;
}
