import express from 'express';
import { ContactModel } from '../models/contact.model';

export const router = express.Router();

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await ContactModel.find();
    res.json({ data: contacts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts' });
  }
});

// Get contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await ContactModel.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ data: contact });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact' });
  }
});

// Create contact
router.post('/', async (req, res) => {
  try {
    const contact = new ContactModel(req.body);
    await contact.save();
    res.status(201).json({ data: contact });
  } catch (error) {
    res.status(400).json({ message: 'Error creating contact' });
  }
}); 