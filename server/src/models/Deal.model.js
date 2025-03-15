import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  }],
  value: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  stage: {
    type: String,
    enum: ['lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
    default: 'lead'
  },
  probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  expectedCloseDate: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  activities: [{
    type: {
      type: String,
      enum: ['call', 'email', 'meeting', 'task']
    },
    description: String,
    date: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for search
dealSchema.index({ name: 'text' });

// Virtual for total value
dealSchema.virtual('totalValue').get(function() {
  if (!this.products || this.products.length === 0) return this.value;
  return this.products.reduce((total, product) => total + (product.quantity * product.price), 0);
});

export default mongoose.model('Deal', dealSchema); 