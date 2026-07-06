import axios, { AxiosError } from "axios";
import { clearToken, getToken } from "../auth/session";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const LOGIN_PATH = "/admin/login";

/** Admin API (CRUD for the /admin area). Requests carry the admin JWT. */
const http = axios.create({
  baseURL: `${API_URL}/api/v2/`,
});

/** Public API used by the restaurant showcase (no auth). */
export const httpV1 = axios.create({
  baseURL: `${API_URL}/api/v1/`,
});

// Attach the admin JWT (when present) to every admin request.
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On an expired/invalid session, drop the token and send the user to login.
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearToken();
      if (window.location.pathname !== LOGIN_PATH) {
        window.location.assign(LOGIN_PATH);
      }
    }
    return Promise.reject(error);
  }
);

export default http;
