import axios from "axios";

import { ApiError } from "./api-error";
import { TRACCAR_BASE_URL } from "./endpoints";

export const httpClient = axios.create({
  baseURL: TRACCAR_BASE_URL,

  // Traccar uses a session cookie after POST /api/session.
  withCredentials: true,

  timeout: 12_000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Normalize Axios errors so the UI can render consistent error states.
    throw new ApiError(
      error.response?.data?.message || error.message || "Unexpected API error",
      status,
    );
  },
);
