import axios from "axios";

/** API administrativa (CRUD da área /admin). */
const http = axios.create({
  baseURL: "http://localhost:8000/api/v2/",
});

/** API pública usada na vitrine de restaurantes. */
export const httpV1 = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
});

export default http;
