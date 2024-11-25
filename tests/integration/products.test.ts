import request from "supertest";
import app from "../../src/app";
import { Restaurant } from "../../src/models/restaurant";

describe("GET /api/restaurants/:id/products", () => {
    beforeEach(async () => {
        await Restaurant.deleteMany({});
    });

    it("Retornar los productos de un restaurante existente", async () => {
        const restaurant = await Restaurant.create({
            name: "Restaurante Prueba",
            products: [
                { name: "Producto 1", price: 10 },
                { name: "Producto 2", price: 20 },
            ],
        });

        const res = await request(app).get(`/api/restaurants/${restaurant._id}/products`);

        expect(res.status).toBe(200);
        expect(res.body.products).toHaveLength(2);
        expect(res.body.products[0]).toMatchObject({
            name: "Producto 1",
            price: 10,
        });
        expect(res.body.products[1]).toMatchObject({
            name: "Producto 2",
            price: 20,
        });
    });

    it("Retornar un error 404 si el restaurante no existe", async () => {
        const nonExistentId = "64e010f6fd1234567890abcd"; // ID no existente
        const res = await request(app).get(`/api/restaurants/${nonExistentId}/products`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message", "Restaurant not found.");
    });
});
