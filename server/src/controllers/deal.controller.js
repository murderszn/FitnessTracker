import asyncHandler from 'express-async-handler';
import Deal from '../models/Deal.model.js';
import Company from '../models/Company.model.js';
import Contact from '../models/Contact.model.js';

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private
export const getDeals = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        name: { $regex: req.query.keyword, $options: 'i' },
      }
    : {};

  const count = await Deal.countDocuments({ ...keyword });
  const deals = await Deal.find({ ...keyword })
    .populate('company', 'name industry')
    .populate('contacts', 'firstName lastName email')
    .populate('owner', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort('-createdAt');

  res.json({
    deals,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Get deal by ID
// @route   GET /api/deals/:id
// @access  Private
export const getDealById = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id)
    .populate('company', 'name industry website')
    .populate('contacts', 'firstName lastName email position')
    .populate('owner', 'name email')
    .populate('activities', 'type description date');

  if (deal) {
    res.json(deal);
  } else {
    res.status(404);
    throw new Error('Deal not found');
  }
});

// @desc    Create a deal
// @route   POST /api/deals
// @access  Private
export const createDeal = asyncHandler(async (req, res) => {
  const {
    name,
    company,
    contacts,
    value,
    currency,
    stage,
    probability,
    expectedCloseDate,
    products,
    notes,
    tags,
  } = req.body;

  const deal = await Deal.create({
    name,
    company,
    contacts,
    value,
    currency,
    stage,
    probability,
    expectedCloseDate,
    products,
    notes,
    tags,
    owner: req.user._id,
  });

  if (deal) {
    // Add deal to company's deals array
    if (company) {
      await Company.findByIdAndUpdate(company, {
        $push: { deals: deal._id },
      });
    }

    // Add deal to contacts' deals arrays
    if (contacts && contacts.length > 0) {
      await Contact.updateMany(
        { _id: { $in: contacts } },
        { $push: { deals: deal._id } }
      );
    }

    const populatedDeal = await Deal.findById(deal._id)
      .populate('company', 'name')
      .populate('contacts', 'firstName lastName')
      .populate('owner', 'name');

    res.status(201).json(populatedDeal);
  } else {
    res.status(400);
    throw new Error('Invalid deal data');
  }
});

// @desc    Update a deal
// @route   PUT /api/deals/:id
// @access  Private
export const updateDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);

  if (deal) {
    // Handle company changes
    if (req.body.company && deal.company.toString() !== req.body.company) {
      // Remove deal from old company
      if (deal.company) {
        await Company.findByIdAndUpdate(deal.company, {
          $pull: { deals: deal._id },
        });
      }
      // Add deal to new company
      await Company.findByIdAndUpdate(req.body.company, {
        $push: { deals: deal._id },
      });
    }

    // Handle contacts changes
    if (req.body.contacts) {
      const oldContacts = deal.contacts.map(c => c.toString());
      const newContacts = req.body.contacts;

      // Remove deal from contacts that are no longer associated
      const removedContacts = oldContacts.filter(c => !newContacts.includes(c));
      if (removedContacts.length > 0) {
        await Contact.updateMany(
          { _id: { $in: removedContacts } },
          { $pull: { deals: deal._id } }
        );
      }

      // Add deal to new contacts
      const addedContacts = newContacts.filter(c => !oldContacts.includes(c));
      if (addedContacts.length > 0) {
        await Contact.updateMany(
          { _id: { $in: addedContacts } },
          { $push: { deals: deal._id } }
        );
      }
    }

    deal.name = req.body.name || deal.name;
    deal.company = req.body.company || deal.company;
    deal.contacts = req.body.contacts || deal.contacts;
    deal.value = req.body.value || deal.value;
    deal.currency = req.body.currency || deal.currency;
    deal.stage = req.body.stage || deal.stage;
    deal.probability = req.body.probability || deal.probability;
    deal.expectedCloseDate = req.body.expectedCloseDate || deal.expectedCloseDate;
    deal.products = req.body.products || deal.products;
    deal.notes = req.body.notes || deal.notes;
    deal.tags = req.body.tags || deal.tags;

    const updatedDeal = await deal.save();
    const populatedDeal = await Deal.findById(updatedDeal._id)
      .populate('company', 'name')
      .populate('contacts', 'firstName lastName')
      .populate('owner', 'name');

    res.json(populatedDeal);
  } else {
    res.status(404);
    throw new Error('Deal not found');
  }
});

// @desc    Delete a deal
// @route   DELETE /api/deals/:id
// @access  Private
export const deleteDeal = asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);

  if (deal) {
    // Remove deal from company's deals array
    if (deal.company) {
      await Company.findByIdAndUpdate(deal.company, {
        $pull: { deals: deal._id },
      });
    }

    // Remove deal from contacts' deals arrays
    if (deal.contacts && deal.contacts.length > 0) {
      await Contact.updateMany(
        { _id: { $in: deal.contacts } },
        { $pull: { deals: deal._id } }
      );
    }

    await deal.deleteOne();
    res.json({ message: 'Deal removed' });
  } else {
    res.status(404);
    throw new Error('Deal not found');
  }
});

// @desc    Get deal statistics
// @route   GET /api/deals/stats
// @access  Private
export const getDealStats = asyncHandler(async (req, res) => {
  const stageStats = await Deal.aggregate([
    {
      $group: {
        _id: '$stage',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' },
        avgValue: { $avg: '$value' },
      },
    },
  ]);

  const monthlyStats = await Deal.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$expectedCloseDate' },
          month: { $month: '$expectedCloseDate' },
        },
        count: { $sum: 1 },
        totalValue: { $sum: '$value' },
        avgProbability: { $avg: '$probability' },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
  ]);

  const probabilityRanges = await Deal.aggregate([
    {
      $bucket: {
        groupBy: '$probability',
        boundaries: [0, 25, 50, 75, 100],
        default: 'Other',
        output: {
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
          deals: { $push: '$name' },
        },
      },
    },
  ]);

  res.json({
    stageStats,
    monthlyStats,
    probabilityRanges,
  });
}); 