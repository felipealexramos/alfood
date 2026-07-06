import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import IDish from '../../../interfaces/IDish';
import { useAdminDishes, useDeleteDish } from '../../../hooks/useAdminDishes';

const AdminDishes = () => {
    const { data: dishes, isLoading, isError } = useAdminDishes();
    const deleteDish = useDeleteDish();

    if (isLoading) {
        return <Typography sx={{ p: 2 }}>Loading…</Typography>;
    }

    if (isError) {
        return (
            <Typography sx={{ p: 2 }} color="error">
                Could not load dishes. Please try again.
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Tag</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Edit</TableCell>
                        <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dishes?.map((dish: IDish) => (
                        <TableRow key={dish.id}>
                            <TableCell>{dish.nome}</TableCell>
                            <TableCell>{dish.descricao}</TableCell>
                            <TableCell>{dish.tag}</TableCell>
                            <TableCell><a href={dish.imagem} rel='noreferrer' target="_blank">View image</a></TableCell>
                            <TableCell>
                                <Link to={`/admin/dishes/${dish.id}`}>Edit</Link>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="error"
                                    disabled={deleteDish.isPending}
                                    onClick={() => deleteDish.mutate(dish.id)}
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

export default AdminDishes;
