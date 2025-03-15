import express from 'express';
import {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  getDealStats,
} from '../controllers/deal.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router
  .route('/')
  .get(getDeals)
  .post(createDeal);

router
  .route('/:id')
  .get(getDealById)
  .put(updateDeal)
  .delete(deleteDeal);

router.get('/stats', getDealStats);

export default router; 