import { Schema, model } from "mongoose";
import { ProductSchema } from "./product";
import { OrderSchema } from "./order";

const RestaurantSchema = new Schema({
    name: String,
    products: [ProductSchema],
    orders: [OrderSchema],
}, { collection: "restaurants" });

export const Restaurant = model("Restaurant", RestaurantSchema, "restaurants"); // Lo exporto como modelo pues interactúa directamente con mi colección en MongoDB