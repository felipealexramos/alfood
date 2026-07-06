import { useEffect, useState } from 'react';
import IRestaurant from '../../../interfaces/IRestaurant';
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../../../http';


const AdminRestaurants = () => {

    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);

    useEffect(() => {
       http.get<IRestaurant[]>('restaurantes/')
            .then(response => {
                setRestaurants(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleDelete = (restaurantToDelete: IRestaurant) => {
        http.delete(`restaurantes/${restaurantToDelete.id}/`)
            .then(() => {
                const remainingRestaurants = restaurants.filter(restaurant => restaurant.id !== restaurantToDelete.id);
                setRestaurants(remainingRestaurants);
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Edit</TableCell>
                        <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {restaurants.map((restaurant) => (
                        <TableRow key={restaurant.id}>
                            <TableCell>{restaurant.nome}</TableCell>
                            <TableCell>
                                <Link to={`/admin/restaurants/${restaurant.id}`}>Edit</Link>
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" color="error" onClick={() => handleDelete(restaurant)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AdminRestaurants;
