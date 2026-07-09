import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../auth/authService";

/** Reads an HTTP status from an unknown error shape (AxiosError or similar). */
function getErrorStatus(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "response" in error) {
    const { response } = error as { response?: { status?: number } };
    return response?.status;
  }
  return undefined;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      // usuario/senha are the backend contract field names — do not translate.
      await login({ usuario: username, senha: password });
      navigate("/admin/restaurants");
    } catch (submitError) {
      setError(
        getErrorStatus(submitError) === 401
          ? "Invalid credentials. Please try again."
          : "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <Box>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h6">
              Admin Sign In
            </Typography>
            <Box
              component="form"
              sx={{ width: "100%" }}
              onSubmit={handleSubmit}
            >
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                label="Username"
                variant="standard"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                label="Password"
                type="password"
                variant="standard"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Button
                sx={{ marginTop: 1 }}
                type="submit"
                fullWidth
                variant="outlined"
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
