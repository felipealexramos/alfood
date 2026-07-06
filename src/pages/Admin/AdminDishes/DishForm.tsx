import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import ITag from "../../../interfaces/ITag";
import IRestaurant from "../../../interfaces/IRestaurant";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const DishForm = () => {
  const { id } = useParams<{ id: string }>();
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<ITag[]>([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    http
      .get<{ tags: ITag[] }>("tags/")
      .then((response) => setTags(response.data.tags));
    http
      .get<IRestaurant[]>("restaurantes/")
      .then((response) => setRestaurants(response.data));

    if (id) {
      http
        .get(`pratos/${id}/`)
        .then((response) => {
          setDishName(response.data.nome);
          setDescription(response.data.descricao);
          setTag(response.data.tag);
          setRestaurantId(response.data.restaurante);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // FormData keys follow the backend API contract (pt-BR) — do not translate them.
    const formData = new FormData();
    formData.append("nome", dishName);
    formData.append("descricao", description);
    formData.append("tag", tag);
    formData.append("restaurante", restaurantId);

    if (image) {
      formData.append("imagem", image);
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `pratos/${id}/` : "pratos/";

    http
      .request({
        url: url,
        method: method,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
      .then(() => {
        setDishName("");
        setDescription("");
        setTag("");
        setRestaurantId("");
        setImage(null);
        alert(`Dish ${id ? "updated" : "created"} successfully!`);
      })
      .catch((error) => {
        console.log(error);
      });
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
              Dish Registration
            </Typography>
            <Box
              component="form"
              sx={{ width: "100%" }}
              onSubmit={handleSubmit}
            >
              <TextField
                value={dishName}
                onChange={(event) => setDishName(event.target.value)}
                label="Dish name"
                variant="standard"
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                label="Dish description"
                variant="standard"
                fullWidth
                required
                sx={{ mb: 2 }}
              />

              <FormControl margin="dense" fullWidth sx={{ mb: 2 }}>
                <InputLabel id="select-tag">Tag</InputLabel>
                <Select
                  labelId="select-tag"
                  value={tag}
                  onChange={(event) => setTag(event.target.value)}
                >
                  {tags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.value}>
                      {tag.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl margin="dense" fullWidth sx={{ mb: 2 }}>
                <InputLabel id="select-restaurant">Restaurant</InputLabel>
                <Select
                  labelId="select-restaurant"
                  value={restaurantId}
                  onChange={(event) => setRestaurantId(event.target.value)}
                >
                  {restaurants.map((restaurant) => (
                    <MenuItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <input
                type="file"
                onChange={handleFileSelect}
                style={{ marginBottom: "16px" }}
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

export default DishForm;
