import http from "../http";
import { setToken } from "./session";

// Field names (usuario/senha) follow the backend API contract (pt-BR) — do not translate them.
export interface LoginCredentials {
  usuario: string;
  senha: string;
}

interface AccessToken {
  access_token: string;
}

/**
 * Exchanges admin credentials for a JWT via POST /api/v2/auth/login and
 * stores the returned access_token for subsequent authenticated requests.
 */
export async function login(credentials: LoginCredentials): Promise<void> {
  const { data } = await http.post<AccessToken>("auth/login/", credentials);
  setToken(data.access_token);
}
