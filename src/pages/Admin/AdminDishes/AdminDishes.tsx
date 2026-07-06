import { useEffect, useState } from 'react';
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../../../http';
import IDish from '../../../interfaces/IDish';


const AdminDishes = () => {

    const [dishes, setDishes] = useState<IDish[]>([]);

    useEffect(() => {
       http.get<IDish[]>('pratos/')
            .then(response => {
                setDishes(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleDelete = (dishToDelete: IDish) => {
        http.delete(`pratos/${dishToDelete.id}/`)
            .then(() => {
                const remainingDishes = dishes.filter(dish => dish.id !== dishToDelete.id);
                setDishes(remainingDishes);
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
                        <TableCell>Description</TableCell>
                        <TableCell>Tag</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Edit</TableCell>
                        <TableCell>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dishes.map((dish) => (
                        <TableRow key={dish.id}>
                            <TableCell>{dish.nome}</TableCell>
                            <TableCell>{dish.descricao}</TableCell>
                            <TableCell>{dish.tag}</TableCell>
                            <TableCell><a href={dish.imagem} rel='noreferrer' target="_blank">View image</a></TableCell>
                            <TableCell>
                                <Link to={`/admin/dishes/${dish.id}`}>Edit</Link>
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" color="error" onClick={() => handleDelete(dish)}>
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
