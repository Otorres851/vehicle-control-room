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
  attributes?: Record<string, unknown>;
};

export async function createSession() {
  const body = new URLSearchParams({
    email: "admin",
    password: "admin",
  });

  const response = await httpClient.post<TraccarSession>(
    ENDPOINTS.session,
    body,
  );

  return response.data;
}

export async function getDevices() {
  const response = await httpClient.get<TraccarDevice[]>(ENDPOINTS.devices);

  return response.data;
}

export async function getPositions() {
  const response = await httpClient.get<TraccarPosition[]>(ENDPOINTS.positions);

  return response.data;
}
