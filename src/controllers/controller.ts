import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant";
import { ProductSchema } from "../models/product";
import { OrderSchema } from "../models/order";
import { InferSchemaType } from "mongoose";

type Product = InferSchemaType<typeof ProductSchema>;
type Order = InferSchemaType<typeof OrderSchema>;
type ProductOrder = Order["products"][number];

interface RestaurantTypeHomePage {
    _id: string;
    name: string;
}

interface ResponseHomePage {
    restaurants: Partial<RestaurantTypeHomePage>[];
    hasMore: boolean;
}

// Devuelve todos los restaurantes, con nombre y _id (campo de MongoDB)
export const getRestaurants = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetcheo de a partes para implementar el infinite scroll
        const limit = parseInt(req.query.limit as string) || 13;
        const skip = parseInt(req.query.skip as string) || 0;
        const limitPlusOne = limit + 1;

        const restaurants = await Restaurant.find({}, { products: 0, orders: 0 }).skip(skip).limit(limitPlusOne).lean<RestaurantTypeHomePage[]>();
        const hasMore = restaurants.length > limit;
        if (hasMore) {
            restaurants.pop(); // Elimina el restaurante extra
        }

        const response: ResponseHomePage = {
            restaurants,
            hasMore,
        };
        res.status(200).json(response);
    } 
    catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ message: "Error fetching restaurants." });
    }
};

// Obtener productos por ID de restaurante
export const getProductsByRestaurantId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const restaurant = await Restaurant.findById(id).select("products").lean<{ products: Product[] }>();

        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found." });
            return;
        }

        res.status(200).json({ products: restaurant.products });
    } 
    catch (error) {
        console.error("Error fetching products by Restaurant ID:", error);
        res.status(500).json({
            message: "Error fetching products by Restaurant ID.",
        });
    }
};

// Obtener ordenes por ID de restaurante
export const getOrdersByRestaurantId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const restaurant = await Restaurant.findById(id).select("orders").lean<{ orders: Order[] }>();

        if (!restaurant) {
            res.status(404).json({ message: "Restaurant not found." });
            return;
        }

        res.status(200).json({ orders: restaurant.orders });
    } 
    catch (error) {
        console.error("Error fetching orders by Restaurant ID:", error);
        res.status(500).json({
            message: "Error fetching orders by Restaurant ID.",
        });
    }
};

// Postear una orden en un restaurante selecto por :id
export const postOrderByRestaurantId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { products, total }: { products: ProductOrder[]; total: number } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            res.status(400).json({
                message: "Products array is required and cannot be empty.",
            });
            return;
        }

        if (!total || typeof total !== "number") {
            res.status(400).json({
                message: "Total is required and must be a number.",
            });
            return;
        }

        // Copias independientes de los productos
        const validProducts = products.map((product) => ({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
        }));

        const newOrder = {
            products: validProducts,
            total,
        };

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            id,
            { $push: { orders: newOrder } },
            { new: true },
        );

        if (!updatedRestaurant) {
            res.status(404).json({ message: "Restaurant not found." });
            return;
        }

        res.status(201).json({
            message: "Order added successfully.",
            order: newOrder,
            restaurant: updatedRestaurant,
        });
    } 
    catch (error) {
        console.error("Error adding order:", error);
        res.status(500).json({
            message: "Error adding order.",
            error: (error as Error).message,
        });
    }
};

// Eliminar una orden especifica dada por :orderId de un restaurante especifico dado por :id
export const deleteOrderByRestaurantId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: restaurantId, orderId } = req.params;

        if (!restaurantId || !orderId) {
            res.status(400).json({
                message: "Restaurant ID and Order ID are required.",
            });
            return;
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            restaurantId,
            { $pull: { orders: { _id: orderId } } },
            { new: true },
        );

        if (!updatedRestaurant) {
            res.status(404).json({ message: "Restaurant not found." });
            return;
        }

        res.status(200).json({
            message: "Order deleted successfully.",
            restaurant: updatedRestaurant,
        });
    } 
    catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({
            message: "Error deleting order.",
            error: (error as Error).message,
        });
    }
};