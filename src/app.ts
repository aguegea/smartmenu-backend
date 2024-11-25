import express, { Application } from "express";
import cors from "cors";
import restaurantRoutes from "./routes/routes";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Rutas
app.use("/api/restaurants", restaurantRoutes);

export default app;