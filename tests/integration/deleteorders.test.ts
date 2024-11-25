import request from "supertest";
import app from "../../src/app";
import { Restaurant } from "../../src/models/restaurant";
import mongoose from "mongoose";

describe("DELETE /api/restaurants/:id/orders/:orderId", () => {
    afterAll(async () => {
        await Restaurant.deleteMany({});
    });

    it("Eliminar una orden existente de un restaurante", async () => {
        const testRestaurant = await Restaurant.create({
            name: "Test Restaurant",
            products: [],
            orders: [
                {
                    products: [
                        { name: "Product 1", price: 10, quantity: 2 },
                        { name: "Product 2", price: 20, quantity: 1 },
                    ],
                    total: 40,
                },
            ],
        });
        const res = await request(app).delete(`/api/restaurants/${testRestaurant._id}/orders/${testRestaurant.orders[0]._id}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty(
            "message",
            "Order deleted successfully.",
        );

        const updatedRestaurant = await Restaurant.findById(testRestaurant._id);
        expect(updatedRestaurant?.orders).toHaveLength(0);
    });

    it("Retornar 404 si el restaurante no existe", async () => {
        const nonExistentRestaurantId = new mongoose.Types.ObjectId();
        const nonExistentOrderId = new mongoose.Types.ObjectId();
        const res = await request(app).delete(`/api/restaurants/${nonExistentRestaurantId}/orders/${nonExistentOrderId}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message", "Restaurant not found.");
    });
});