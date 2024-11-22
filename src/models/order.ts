import { Schema } from "mongoose";
import ProductSchema from "./product";

const OrderSchema = new Schema({
    products: [ProductSchema], 
    total: Number,
})

export default OrderSchema;
