import express from 'express';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getContactStats,
} from '../controllers/contact.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router
  .route('/')
  .get(getContacts)
  .post(createContact);

router
  .route('/:id')
  .get(getContactById)
  .put(updateContact)
  .delete(deleteContact);

router.get('/stats', getContactStats);

export default router; 