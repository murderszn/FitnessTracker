import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as userRoutes } from './routes/user.routes';
import { router as contactRoutes } from './routes/contact.routes';
import { router as companyRoutes } from './routes/company.routes';
import { router as dealRoutes } from './routes/deal.routes';
import { router as taskRoutes } from './routes/task.routes';
import { router as activityRoutes } from './routes/activity.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5176', // Updated to match the client's port
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/activities', activityRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5176;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 