import asyncHandler from 'express-async-handler';
import Company from '../models/Company.model.js';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
export const getCompanies = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { industry: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const count = await Company.countDocuments({ ...keyword });
  const companies = await Company.find({ ...keyword })
    .populate('owner', 'name')
    .populate('contacts', 'firstName lastName email')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort('-createdAt');

  res.json({
    companies,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
export const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('contacts', 'firstName lastName email position')
    .populate('deals', 'name value stage expectedCloseDate');

  if (company) {
    res.json(company);
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

// @desc    Create a company
// @route   POST /api/companies
// @access  Private
export const createCompany = asyncHandler(async (req, res) => {
  const {
    name,
    industry,
    website,
    location,
    size,
    revenue,
    status,
    tags,
  } = req.body;

  const company = await Company.create({
    name,
    industry,
    website,
    location,
    size,
    revenue,
    status,
    tags,
    owner: req.user._id,
  });

  if (company) {
    const populatedCompany = await Company.findById(company._id)
      .populate('owner', 'name');

    res.status(201).json(populatedCompany);
  } else {
    res.status(400);
    throw new Error('Invalid company data');
  }
});

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Private
export const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (company) {
    company.name = req.body.name || company.name;
    company.industry = req.body.industry || company.industry;
    company.website = req.body.website || company.website;
    company.location = req.body.location || company.location;
    company.size = req.body.size || company.size;
    company.revenue = req.body.revenue || company.revenue;
    company.status = req.body.status || company.status;
    company.tags = req.body.tags || company.tags;
    company.notes = req.body.notes || company.notes;

    const updatedCompany = await company.save();
    const populatedCompany = await Company.findById(updatedCompany._id)
      .populate('owner', 'name')
      .populate('contacts', 'firstName lastName email');

    res.json(populatedCompany);
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

// @desc    Delete a company
// @route   DELETE /api/companies/:id
// @access  Private
export const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (company) {
    await company.deleteOne();
    res.json({ message: 'Company removed' });
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

// @desc    Get company statistics
// @route   GET /api/companies/stats
// @access  Private
export const getCompanyStats = asyncHandler(async (req, res) => {
  const industryStats = await Company.aggregate([
    {
      $group: {
        _id: '$industry',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$revenue' },
        avgSize: { $avg: '$size' },
      },
    },
  ]);

  const statusStats = await Company.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const sizeRanges = await Company.aggregate([
    {
      $bucket: {
        groupBy: '$size',
        boundaries: [0, 10, 50, 200, 1000, Infinity],
        default: 'Unknown',
        output: {
          count: { $sum: 1 },
          companies: { $push: '$name' },
        },
      },
    },
  ]);

  res.json({
    industryStats,
    statusStats,
    sizeRanges,
  });
}); 