import asyncHandler from 'express-async-handler';
import Contact from '../models/Contact.model.js';
import Company from '../models/Company.model.js';

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
export const getContacts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { firstName: { $regex: req.query.keyword, $options: 'i' } },
          { lastName: { $regex: req.query.keyword, $options: 'i' } },
          { email: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const count = await Contact.countDocuments({ ...keyword });
  const contacts = await Contact.find({ ...keyword })
    .populate('company', 'name')
    .populate('owner', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort('-createdAt');

  res.json({
    contacts,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Get contact by ID
// @route   GET /api/contacts/:id
// @access  Private
export const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
    .populate('company', 'name industry website')
    .populate('owner', 'name email')
    .populate('deals', 'name value stage');

  if (contact) {
    res.json(contact);
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

// @desc    Create a contact
// @route   POST /api/contacts
// @access  Private
export const createContact = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    company,
    position,
    status,
    source,
    tags,
  } = req.body;

  const contact = await Contact.create({
    firstName,
    lastName,
    email,
    phone,
    company,
    position,
    status,
    source,
    tags,
    owner: req.user._id,
  });

  if (contact) {
    // If company is provided, add contact to company's contacts array
    if (company) {
      await Company.findByIdAndUpdate(company, {
        $push: { contacts: contact._id },
      });
    }

    const populatedContact = await Contact.findById(contact._id)
      .populate('company', 'name')
      .populate('owner', 'name');

    res.status(201).json(populatedContact);
  } else {
    res.status(400);
    throw new Error('Invalid contact data');
  }
});

// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Private
export const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    // If company is being changed, update the old and new company's contacts arrays
    if (req.body.company && contact.company.toString() !== req.body.company) {
      // Remove contact from old company
      if (contact.company) {
        await Company.findByIdAndUpdate(contact.company, {
          $pull: { contacts: contact._id },
        });
      }
      // Add contact to new company
      await Company.findByIdAndUpdate(req.body.company, {
        $push: { contacts: contact._id },
      });
    }

    contact.firstName = req.body.firstName || contact.firstName;
    contact.lastName = req.body.lastName || contact.lastName;
    contact.email = req.body.email || contact.email;
    contact.phone = req.body.phone || contact.phone;
    contact.company = req.body.company || contact.company;
    contact.position = req.body.position || contact.position;
    contact.status = req.body.status || contact.status;
    contact.source = req.body.source || contact.source;
    contact.tags = req.body.tags || contact.tags;
    contact.notes = req.body.notes || contact.notes;

    const updatedContact = await contact.save();
    const populatedContact = await Contact.findById(updatedContact._id)
      .populate('company', 'name')
      .populate('owner', 'name');

    res.json(populatedContact);
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    // Remove contact from company's contacts array
    if (contact.company) {
      await Company.findByIdAndUpdate(contact.company, {
        $pull: { contacts: contact._id },
      });
    }

    await contact.deleteOne();
    res.json({ message: 'Contact removed' });
  } else {
    res.status(404);
    throw new Error('Contact not found');
  }
});

// @desc    Get contact statistics
// @route   GET /api/contacts/stats
// @access  Private
export const getContactStats = asyncHandler(async (req, res) => {
  const stats = await Contact.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const sourceStats = await Contact.aggregate([
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    statusStats: stats,
    sourceStats,
  });
}); 