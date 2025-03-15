import express from 'express';
import { UserModel } from '../models/user.model.js';

export const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find().select('-password');
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const user = new UserModel(req.body);
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({ data: userResponse });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user' });
  }
}); 