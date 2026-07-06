import IRestaurant from '../../../interfaces/IRestaurant';
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAdminRestaurants, useDeleteRestaurant } from '../../../hooks/useAdminRestaurants';

const AdminRestaurants = () => {
    const { data: restaurants, isLoading, isError } = useAdminRestaurants();
    const deleteRestaurant = useDeleteRestaurant();

    if (isLoading) {
        return <Typography sx={{ p: 2 }}>Loading…</Typography>;
    }

    if (isError) {
        return (
            <Typography sx={{ p: 2 }} color="error">
                Could not load restaurants. Please try again.
            </Typography>
        );
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
                    {restaurants?.map((restaurant: IRestaurant) => (
                        <TableRow key={restaurant.id}>
                            <TableCell>{restaurant.nome}</TableCell>
                            <TableCell>
                                <Link to={`/admin/restaurants/${restaurant.id}`}>Edit</Link>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="error"
                                    disabled={deleteRestaurant.isPending}
                                    onClick={() => deleteRestaurant.mutate(restaurant.id)}
                                >
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
