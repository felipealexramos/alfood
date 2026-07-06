import {
  AppBar,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, Link as RouterLink } from "react-router-dom";

const AdminBasePage = () => {

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Restaurant Administration
            </Typography>
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              <Link component={RouterLink} to="/admin/restaurants">
                <Button sx={{ my: 2, color: "white" }}>Restaurants</Button>
              </Link>
              <Link component={RouterLink} to="/admin/restaurants/new">
                <Button sx={{ my: 2, color: "white" }}>New Restaurant</Button>
              </Link>
              <Link component={RouterLink} to="/admin/dishes">
                <Button sx={{ my: 2, color: "white" }}>Dishes</Button>
              </Link>
              <Link component={RouterLink} to="/admin/dishes/new">
                <Button sx={{ my: 2, color: "white" }}>New Dish</Button>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box>
        <Container maxWidth="lg" sx={{ mt: 1 }}>
          <Paper sx={{ p: 2 }}>
            <Outlet />
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default AdminBasePage;
