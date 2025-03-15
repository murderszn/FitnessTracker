import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Route imports
import authRoutes from './routes/auth.routes.js';
import contactRoutes from './routes/contact.routes.js';
import companyRoutes from './routes/company.routes.js';
import dealRoutes from './routes/deal.routes.js';
import taskRoutes from './routes/task.routes.js';

// Middleware imports
import { errorHandler } from './middleware/error.middleware.js';
import { authMiddleware } from './middleware/auth.middleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', authMiddleware, contactRoutes);
app.use('/api/companies', authMiddleware, companyRoutes);
app.use('/api/deals', authMiddleware, dealRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);

// Error handling
app.use(errorHandler);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 