import { Request, Response } from 'express';
import { Restaurant } from '../models/restaurant';
import { ProductSchema } from '../models/product';
import { OrderSchema } from '../models/order';
import { InferSchemaType } from 'mongoose';

// Devuelve todos los restaurantes, con nombre y _id (campo de MongoDB)
interface RestaurantTypeHomePage {
    _id: string;
    name: string;
}

interface ResponseHomePage {
    restaurants: Partial<RestaurantTypeHomePage>[];
    hasMore: boolean;
}

export const getRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 13;
        const skip = parseInt(req.query.skip as string) || 0;

        const restaurants = await Restaurant.find({}, { products: 0, orders: 0 }).skip(skip).limit(limit).lean<RestaurantTypeHomePage[]>();
        const hasMore = restaurants.length === limit; // Chequeo si siguen quedando restaurantes para fetchear

        const response: ResponseHomePage = {
            restaurants,
            hasMore,
        };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error al obtener los restaurantes:', error);
        res.status(500).json({ message: 'Error al obtener los restaurantes' });
    }
};

// Devuelve los productos y ordenes de un restaurante dado por el param :id
type Product = InferSchemaType<typeof ProductSchema>;
type Order = InferSchemaType<typeof OrderSchema>;
interface ResponseRestaurantPage {
    products: Product[];
    orders: Order[];
  }

export const getRestaurantById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const restaurant = await Restaurant.findById(id).select('products orders').lean<{ products: Product[]; orders: Order[] }>();

        if (!restaurant) {
            res.status(404).json({ message: 'Restaurant not found' });
            return;
        }

        const response: ResponseRestaurantPage = {
            products: restaurant.products,
            orders: restaurant.orders,
        };
      
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching restaurant by ID:', error);
        res.status(500).json({ message: 'Error fetching restaurant' });
    }
};