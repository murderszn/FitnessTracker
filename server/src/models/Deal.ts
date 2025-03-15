import mongoose from 'mongoose';

interface IProduct {
  name: string;
  quantity: number;
  price: number;
}

export interface IDeal {
  title: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability?: number;
  expectedCloseDate?: Date;
  company: mongoose.Types.ObjectId;
  contact: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  products?: IProduct[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const dealSchema = new mongoose.Schema<IDeal>({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  stage: {
    type: String,
    required: true,
    enum: ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
    default: 'lead'
  },
  probability: {
    type: Number,
    min: 0,
    max: 100
  },
  expectedCloseDate: {
    type: Date
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [productSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total value based on products
dealSchema.virtual('calculatedValue').get(function() {
  if (!this.products?.length) return this.value;
  return this.products.reduce((total, product) => total + (product.quantity * product.price), 0);
});

// Indexes
dealSchema.index({ company: 1 });
dealSchema.index({ contact: 1 });
dealSchema.index({ assignedTo: 1 });
dealSchema.index({ stage: 1 });

export const Deal = mongoose.model<IDeal>('Deal', dealSchema); 