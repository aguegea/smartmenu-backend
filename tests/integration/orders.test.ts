import request from "supertest";
import app from "../../src/app";
import { Restaurant } from "../../src/models/restaurant";

describe("GET /api/restaurants/:id/orders", () => {
    afterAll(async () => {
        await Restaurant.deleteMany({});
    });

    it("Retornar las órdenes de un restaurante existente", async () => {
        const restaurant = await Restaurant.create({
            name: "Test Restaurant",
            orders: [
                {
                    products: [
                        { name: "Product 1", price: 10, quantity: 2 },
                        { name: "Product 2", price: 5, quantity: 1 },
                    ],
                    total: 25,
                },
                {
                    products: [
                        { name: "Product 3", price: 15, quantity: 1 },
                        { name: "Product 4", price: 20, quantity: 1 },
                    ],
                    total: 35,
                },
            ],
        });
        const res = await request(app).get(`/api/restaurants/${restaurant._id}/orders`);

        expect(res.status).toBe(200);
        expect(res.body.orders).toHaveLength(2);

        // Verifica la primera orden
        expect(res.body.orders[0]).toMatchObject({
            total: 25,
            products: [
                { name: "Product 1", price: 10, quantity: 2 },
                { name: "Product 2", price: 5, quantity: 1 },
            ],
        });

        // Verifica la segunda orden
        expect(res.body.orders[1]).toMatchObject({
            total: 35,
            products: [
                { name: "Product 3", price: 15, quantity: 1 },
                { name: "Product 4", price: 20, quantity: 1 },
            ],
        });
    });

    it("Retornar 404 si el restaurante no existe", async () => {
        const invalidId = "64b83a7f4b5d6e001fc7a123"; // ID valido pero inexistente en la base de datos
        const res = await request(app).get(`/api/restaurants/${invalidId}/orders`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message", "Restaurant not found.");
    });
});
