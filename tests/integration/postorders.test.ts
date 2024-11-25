import request from "supertest";
import app from "../../src/app";
import { Restaurant } from "../../src/models/restaurant";

describe("POST /api/restaurants/:id/orders", () => {
    afterAll(async () => {
        await Restaurant.deleteMany({});
    });

    it("Agregar una orden a un restaurante existente", async () => {
        const restaurant = await Restaurant.create({
            name: "Add order resturant",
            products: [],
            orders: [],
        });

        const newOrder = {
            products: [
                { name: "Product 1", price: 10, quantity: 2 },
                { name: "Product 2", price: 20, quantity: 1 },
            ],
            total: 40,
        };

        const res = await request(app).post(`/api/restaurants/${restaurant._id}/orders`).send(newOrder);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "Order added successfully.");
        expect(res.body).toHaveProperty("order");
        expect(res.body.order).toMatchObject(newOrder);

        const updatedRestaurant = await Restaurant.findById(restaurant._id).lean();
        expect(updatedRestaurant!.orders).toHaveLength(1);
        expect(updatedRestaurant!.orders[0]).toMatchObject(newOrder);
    });

    it("Retornar 400 si los productos no son válidos o están vacíos", async () => {
        const invalidOrder = { products: [], total: 40 };
        const restaurant = await Restaurant.create({
            name: "No order restaurant",
            products: [],
            orders: [],
        });

        const res = await request(app).post(`/api/restaurants/${restaurant._id}/orders`).send(invalidOrder);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty(
            "message",
            "Products array is required and cannot be empty.",
        );
    });

    it("Retornar 404 si el restaurante no existe", async () => {
        const nonExistentId = "64b83a7f4b5d6e001fc7a123"; // ID inexistente
        const newOrder = {
            products: [{ name: "Product 1", price: 10, quantity: 2 }],
            total: 20,
        };

        const res = await request(app).post(`/api/restaurants/${nonExistentId}/orders`).send(newOrder);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message", "Restaurant not found.");
    });
});
