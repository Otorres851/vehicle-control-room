import axios from "axios";

import { ApiError } from "./api-error";
import { TRACCAR_BASE_URL } from "./endpoints";

const TRACCAR_EMAIL = import.meta.env.VITE_TRACCAR_EMAIL;
const TRACCAR_PASSWORD = import.meta.env.VITE_TRACCAR_PASSWORD;

export const httpClient = axios.create({
  baseURL: TRACCAR_BASE_URL,
  timeout: 12_000,

  // Avoid relying on cross-site cookies from the public demo server.
  auth: {
    username: TRACCAR_EMAIL,
    password: TRACCAR_PASSWORD,
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    throw new ApiError(
      error.response?.data?.message || error.message || "Unexpected API error",
      status,
    );
  },
);
