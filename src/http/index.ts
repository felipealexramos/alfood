import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

/** Admin API (CRUD for the /admin area). */
const http = axios.create({
  baseURL: `${API_URL}/api/v2/`,
});

/** Public API used by the restaurant showcase. */
export const httpV1 = axios.create({
  baseURL: `${API_URL}/api/v1/`,
});

export default http;
