import express from 'express';
import { CompanyModel } from '../models/company.model.js';

export const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await CompanyModel.find().sort({ createdAt: -1 });
    res.json({ data: { companies } });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Failed to fetch companies' });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await CompanyModel.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ data: company });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ message: 'Failed to fetch company' });
  }
});

// Create company
router.post('/', async (req, res) => {
  try {
    const { name, industry, location, website, employees, revenue, status } = req.body;

    // Validate required fields
    if (!name || !industry || !location) {
      return res.status(400).json({ 
        message: 'Name, industry, and location are required fields' 
      });
    }

    const company = new CompanyModel({
      name,
      industry,
      location,
      website,
      employees,
      revenue,
      status: status || 'active'
    });

    const savedCompany = await company.save();
    res.status(201).json({ data: savedCompany });
  } catch (error) {
    console.error('Error creating company:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message || 'Failed to create company' });
    } else {
      res.status(400).json({ message: 'Failed to create company' });
    }
  }
});

// Update company
router.put('/:id', async (req, res) => {
  try {
    const { name, industry, location, website, employees, revenue, status } = req.body;

    // Validate required fields if they are being updated
    if ((name === undefined && industry === undefined && location === undefined) ||
        (name === '' || industry === '' || location === '')) {
      return res.status(400).json({ 
        message: 'At least one of name, industry, or location must be provided' 
      });
    }

    const company = await CompanyModel.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        industry, 
        location, 
        website, 
        employees, 
        revenue, 
        status,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ data: company });
  } catch (error) {
    console.error('Error updating company:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message || 'Failed to update company' });
    } else {
      res.status(400).json({ message: 'Failed to update company' });
    }
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    const company = await CompanyModel.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ data: null, message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ message: 'Failed to delete company' });
  }
}); 