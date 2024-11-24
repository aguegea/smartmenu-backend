import { Router } from 'express';
import { getRestaurants, getRestaurantById, postOrderByRestaurantId, deleteOrderByRestaurantId } from '../controllers/controller';

const router = Router();

// GET
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// POST
router.post('/:id/orders', postOrderByRestaurantId);

// DELETE
router.delete('/:id/orders/:orderId', deleteOrderByRestaurantId);

export default router;