import { Schema } from "mongoose";

export const ProductSchema = new Schema({
    name: String,
    price: Number,
});