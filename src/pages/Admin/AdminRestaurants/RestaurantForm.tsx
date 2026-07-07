import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { restaurantSchema, RestaurantFormValues } from "./restaurantSchema";
import {
  useRestaurant,
  useSaveRestaurant,
} from "../../../hooks/useAdminRestaurants";

const RestaurantForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: restaurant } = useRestaurant(id);
  const saveRestaurant = useSaveRestaurant(id);
  const [successOpen, setSuccessOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: { nome: "" },
  });

  useEffect(() => {
    if (restaurant) {
      reset({ nome: restaurant.nome });
    }
  }, [restaurant, reset]);

  const onSubmit = (values: RestaurantFormValues) => {
    saveRestaurant.mutate(values, {
      onSuccess: () => setSuccessOpen(true),
    });
  };

  const closeAndReturn = () => {
    setSuccessOpen(false);
    navigate("/admin/restaurants");
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
            <Box
              component="form"
              sx={{ width: "100%" }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextField
                {...register("nome")}
                label="Restaurant name"
                variant="standard"
                fullWidth
                error={Boolean(errors.nome)}
                helperText={errors.nome?.message}
              />
              <Button
                sx={{ marginTop: 1 }}
                type="submit"
                fullWidth
                variant="outlined"
                disabled={saveRestaurant.isPending}
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
          Restaurant {id ? "updated" : "created"} successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RestaurantForm;
