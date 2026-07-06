import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RestaurantShowcase from "./pages/RestaurantShowcase";
import AdminRestaurants from "./pages/Admin/AdminRestaurants/AdminRestaurants";
import RestaurantForm from "./pages/Admin/AdminRestaurants/RestaurantForm";
import AdminBasePage from "./pages/Admin/AdminBasePage";
import AdminDishes from "./pages/Admin/AdminDishes/AdminDishes";
import DishForm from "./pages/Admin/AdminDishes/DishForm";
import LoginPage from "./pages/Admin/Login/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restaurants" element={<RestaurantShowcase />} />

      <Route path="/admin/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminBasePage />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/restaurants" element={<AdminRestaurants />} />
        <Route path="/admin/restaurants/new" element={<RestaurantForm />} />
        <Route path="/admin/restaurants/:id" element={<RestaurantForm />} />
        <Route path="/admin/dishes" element={<AdminDishes />} />
        <Route path="/admin/dishes/new" element={<DishForm />} />
        <Route path="/admin/dishes/:id" element={<DishForm />} />
      </Route>
    </Routes>
  );
}

export default App;
