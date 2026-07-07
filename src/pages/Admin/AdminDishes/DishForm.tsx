import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { dishSchema, DishFormValues } from "./dishSchema";
import { useTags } from "../../../hooks/useTags";
import { useAdminRestaurants } from "../../../hooks/useAdminRestaurants";
import { useDish, useSaveDish } from "../../../hooks/useAdminDishes";

const DishForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tags = [] } = useTags();
  const { data: restaurants = [] } = useAdminRestaurants();
  const { data: dish } = useDish(id);
  const saveDish = useSaveDish(id);
  const [successOpen, setSuccessOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DishFormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      tag: "",
      restaurante: "",
      imagem: undefined,
    },
  });

  useEffect(() => {
    if (dish) {
      reset({
        nome: dish.nome,
        descricao: dish.descricao,
        tag: dish.tag,
        restaurante: String(dish.restaurante),
        imagem: undefined,
      });
    }
  }, [dish, reset]);

  const onSubmit = (values: DishFormValues) => {
    saveDish.mutate(values, {
      onSuccess: () => setSuccessOpen(true),
    });
  };

  const closeAndReturn = () => {
    setSuccessOpen(false);
    navigate("/admin/dishes");
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
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextField
                {...register("nome")}
                label="Dish name"
                variant="standard"
                fullWidth
                error={Boolean(errors.nome)}
                helperText={errors.nome?.message}
                sx={{ mb: 2 }}
              />
              <TextField
                {...register("descricao")}
                label="Dish description"
                variant="standard"
                fullWidth
                error={Boolean(errors.descricao)}
                helperText={errors.descricao?.message}
                sx={{ mb: 2 }}
              />

              <FormControl
                margin="dense"
                fullWidth
                sx={{ mb: 2 }}
                error={Boolean(errors.tag)}
              >
                <InputLabel id="select-tag">Tag</InputLabel>
                <Controller
                  name="tag"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="select-tag" label="Tag" {...field}>
                      {tags.map((tag) => (
                        <MenuItem key={tag.id} value={tag.value}>
                          {tag.value}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.tag && <FormHelperText>{errors.tag.message}</FormHelperText>}
              </FormControl>

              <FormControl
                margin="dense"
                fullWidth
                sx={{ mb: 2 }}
                error={Boolean(errors.restaurante)}
              >
                <InputLabel id="select-restaurant">Restaurant</InputLabel>
                <Controller
                  name="restaurante"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="select-restaurant"
                      label="Restaurant"
                      {...field}
                    >
                      {restaurants.map((restaurant) => (
                        <MenuItem key={restaurant.id} value={String(restaurant.id)}>
                          {restaurant.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.restaurante && (
                  <FormHelperText>{errors.restaurante.message}</FormHelperText>
                )}
              </FormControl>

              <input
                type="file"
                aria-label="Dish image"
                onChange={(event) =>
                  setValue("imagem", event.target.files?.[0], {
                    shouldValidate: true,
                  })
                }
                style={{ marginBottom: "8px" }}
              />
              {errors.imagem && (
                <FormHelperText error>{errors.imagem.message}</FormHelperText>
              )}

              <Button
                sx={{ marginTop: 1 }}
                type="submit"
                fullWidth
                variant="outlined"
                disabled={saveDish.isPending}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={successOpen}
        autoHideDuration={1500}
        onClose={closeAndReturn}
      >
        <Alert severity="success" onClose={closeAndReturn} sx={{ width: "100%" }}>
          Dish {id ? "updated" : "created"} successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DishForm;
