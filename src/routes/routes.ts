import { Router } from "express";
import { getRestaurants, postOrderByRestaurantId, deleteOrderByRestaurantId, getOrdersByRestaurantId, getProductsByRestaurantId } from "../controllers/controller";

const router = Router();

// GET
router.get("/", getRestaurants);
router.get("/:id/products", getProductsByRestaurantId);
router.get("/:id/orders", getOrdersByRestaurantId);

// POST
router.post("/:id/orders", postOrderByRestaurantId);

// DELETE
router.delete("/:id/orders/:orderId", deleteOrderByRestaurantId);

export default router;