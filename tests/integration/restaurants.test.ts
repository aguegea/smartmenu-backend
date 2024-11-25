import request from "supertest";
import app from "../../src/app";
import { Restaurant } from "../../src/models/restaurant";

describe("GET /api/restaurants", () => {
    beforeEach(async () => {
        await Restaurant.deleteMany({});
    });

    it("Retornar una lista vacía cuando no hay restaurantes en la base de datos", async () => {
        const res = await request(app).get("/api/restaurants");

        expect(res.status).toBe(200);
        expect(res.body.restaurants).toHaveLength(0);
        expect(res.body).toHaveProperty("hasMore", false);
    });

    it("Retornar una lista de restaurantes existentes", async () => {
        const restaurants = [
            { name: "Restaurante Uno" },
            { name: "Restaurante Dos" },
        ];
        await Restaurant.insertMany(restaurants);

        const res = await request(app).get("/api/restaurants");

        expect(res.status).toBe(200);
        expect(res.body.restaurants).toHaveLength(2);
        expect(res.body.restaurants[0]).toMatchObject({
            name: "Restaurante Uno",
        });
        expect(res.body.restaurants[1]).toMatchObject({
            name: "Restaurante Dos",
        });
        expect(res.body).toHaveProperty("hasMore", false);
    });

    it('Respetar el parámetro limit', async () => {
        const restaurants = Array.from({ length: 10 }, (_, i) => ({
            name: `Restaurante ${i + 1}`,
        }));
        await Restaurant.insertMany(restaurants);

        const res = await request(app).get("/api/restaurants").query({ limit: 5 });

        expect(res.status).toBe(200);
        expect(res.body.restaurants).toHaveLength(5);
        expect(res.body).toHaveProperty("hasMore", true);
    });
});
