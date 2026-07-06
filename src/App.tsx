import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RestaurantShowcase from "./pages/RestaurantShowcase";
import AdminRestaurants from "./pages/Admin/AdminRestaurants/AdminRestaurants";
import RestaurantForm from "./pages/Admin/AdminRestaurants/RestaurantForm";
import AdminBasePage from "./pages/Admin/AdminBasePage";
import AdminDishes from "./pages/Admin/AdminDishes/AdminDishes";
import DishForm from "./pages/Admin/AdminDishes/DishForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restaurants" element={<RestaurantShowcase />} />

      <Route path="/admin" element={<AdminBasePage />}>
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
