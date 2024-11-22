import { Request, Response } from 'express';
import { Restaurant } from '../models/restaurant';

// Devuelve todos los restaurantes, con nombre y _id (campo de mongoDB)
export const getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {
        const restaurants = await Restaurant.find({}, { products: 0, orders: 0 });
        console.log('Restaurantes encontrados:', restaurants);
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error al obtener los restaurantes:', error);
        res.status(500).json({ message: 'Error al obtener los restaurantes' });
    }
};

// Ordenes del restaurante indicado por :id en el path
export const getOrdersByRestaurantId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id, { orders: 1, _id: 0 });

        if (!restaurant) {
            res.status(404).json({ message: 'Restaurante no encontrado' });
            return;
        }

        res.status(200).json(restaurant.orders);
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        res.status(500).json({ message: 'Error al obtener las órdenes' });
    }
};

// Productos del restaurante indicado por :id en el path
export const getProductsByRestaurantId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id, { products: 1, _id: 0 });

        if (!restaurant) {
            res.status(404).json({ message: 'Restaurante no encontrado' });
            return;
        }

        res.status(200).json(restaurant.products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
};

// LAS FUNCIONES GETPRODUCTS Y GETORDERS REPITEN CODIGO. VER LUEGO SI ES POSIBLE REUTILIZAR CODIGO