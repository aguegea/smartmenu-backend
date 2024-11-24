import { Schema } from "mongoose";

const ProductSchemaOrder = new Schema ({
    name: String,
    price: Number,
    quantity: Number,
});

export const OrderSchema = new Schema({
    products: [ProductSchemaOrder], 
    total: Number,
});