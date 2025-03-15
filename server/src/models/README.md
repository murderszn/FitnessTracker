# Models

This directory contains all Mongoose models and schemas for the application's data structure.

## Directory Structure

```
models/
├── User.ts           # User model and schema
├── Workout.ts        # Workout model and schema
├── Exercise.ts       # Exercise model and schema
└── types/           # TypeScript interfaces for models
```

## Model Guidelines

1. **Schema Design**
   - Use appropriate data types
   - Implement validation rules
   - Set default values
   - Define indexes

2. **Type Safety**
   - Use TypeScript interfaces
   - Define model types
   - Document relationships
   - Handle edge cases

## Example Model Structure

```typescript
// Example User model
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);
```

## Best Practices

1. **Schema Design**
   - Keep schemas focused and simple
   - Use appropriate field types
   - Implement proper validation
   - Set appropriate indexes

2. **Data Validation**
   - Validate required fields
   - Implement custom validators
   - Handle edge cases
   - Sanitize inputs

3. **Performance**
   - Use appropriate indexes
   - Implement lean queries
   - Handle large datasets
   - Optimize query patterns

## Relationships

1. **Model References**
   - Use ObjectId references
   - Document relationships
   - Handle cascading operations
   - Maintain data integrity

2. **Embedded Documents**
   - Use when appropriate
   - Keep documents small
   - Handle versioning
   - Manage updates properly

## Middleware

1. **Pre/Post Hooks**
   - Hash passwords
   - Update timestamps
   - Validate data
   - Handle cascading deletes

2. **Virtual Properties**
   - Compute derived data
   - Handle formatting
   - Cache calculations
   - Maintain consistency

## Indexes

1. **Index Types**
   - Single field indexes
   - Compound indexes
   - Text indexes
   - Geospatial indexes

2. **Index Options**
   - Unique constraints
   - Sparse indexes
   - TTL indexes
   - Background building

## Error Handling

1. **Validation Errors**
   - Custom error messages
   - Field-level validation
   - Type checking
   - Required fields

2. **Database Errors**
   - Duplicate key errors
   - Connection errors
   - Timeout errors
   - Query errors

## Testing

1. **Unit Tests**
   - Test validation
   - Test middleware
   - Test methods
   - Test relationships

2. **Integration Tests**
   - Test CRUD operations
   - Test relationships
   - Test indexes
   - Test performance

## Documentation

Each model should include:
- Field descriptions
- Validation rules
- Relationships
- Indexes
- Methods
- Middleware
- Example usage 