import { Router } from 'express';
import { getAllRestaurants, getOrdersByRestaurantId, getProductsByRestaurantId } from '../controllers/controller';

const router = Router();

router.get('/', getAllRestaurants);

router.get('/:id/orders', getOrdersByRestaurantId);

router.get('/:id/products', getProductsByRestaurantId);

export default router;
