import express from 'express';
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyStats,
} from '../controllers/company.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router
  .route('/')
  .get(getCompanies)
  .post(createCompany);

router
  .route('/:id')
  .get(getCompanyById)
  .put(updateCompany)
  .delete(deleteCompany);

router.get('/stats', getCompanyStats);

export default router; 