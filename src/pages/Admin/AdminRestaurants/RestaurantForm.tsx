import {
  Box,
  Button,
  Container, Paper,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IRestaurant from "../../../interfaces/IRestaurant";
import http from "../../../http";

const RestaurantForm = () => {
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      http
        .get<IRestaurant>(`restaurantes/${params.id}/`)
        .then((response) => setRestaurantName(response.data.nome));
    }
  }, [params]);

  const [restaurantName, setRestaurantName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (params.id) {
      http
        .put(`restaurantes/${params.id}/`, {
          nome: restaurantName,
        })
        .then(() => {
          alert("Restaurant updated successfully!");
        });
    } else {
      http
        .post("restaurantes/", {
          nome: restaurantName,
        })
        .then(() => {
          setRestaurantName("");
          alert("Restaurant created successfully!");
        });
    }
  };

  return (
      <Box>
        <Container maxWidth="lg" sx={{ mt: 1 }}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h6">
                Restaurant Registration
              </Typography>
              <Box component="form" sx={{ width: '100%'}} onSubmit={handleSubmit}>
                <TextField
                  value={restaurantName}
                  onChange={(event) => setRestaurantName(event.target.value)}
                  label="Restaurant name"
                  variant="standard"
                  fullWidth
                  required
                />
                <Button
                  sx={{ marginTop: 1 }}
                  type="submit"
                  fullWidth
                  variant="outlined"
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
  );
};

export default RestaurantForm;
