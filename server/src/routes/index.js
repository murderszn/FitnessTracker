import express from 'express';
import authRoutes from './auth.routes.js';
import contactRoutes from './contact.routes.js';
import companyRoutes from './company.routes.js';
import dealRoutes from './deal.routes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/contacts', contactRoutes);
router.use('/companies', companyRoutes);
router.use('/deals', dealRoutes);

export default router; 