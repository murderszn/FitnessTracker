# Fitness Tracker Backend

The backend server for the Fitness Tracker application, built with Node.js, TypeScript, and MongoDB.

## Tech Stack Details

- **Node.js**: Runtime environment
- **TypeScript**: Programming language
- **MongoDB**: Database
- **Express**: Web framework
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication
- **Jest**: Testing framework

## Directory Structure

```
server/
├── src/                # Source code
│   ├── controllers/    # Request handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript types
│   ├── config/        # Configuration files
│   └── app.ts         # Application entry
├── db/                # Database scripts and migrations
└── tests/            # Test files
```

## Configuration Details

### TypeScript Configuration
`tsconfig.json` includes:
- ES6 module support
- Strict type checking
- Path aliases
- Source map generation

### Environment Variables
Required variables in `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fitness_tracker
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Database Configuration
- MongoDB connection settings
- Mongoose schema configurations
- Indexing strategies

## API Structure

### Authentication Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh-token

### User Endpoints
- GET /api/users/profile
- PUT /api/users/profile
- GET /api/users/settings

### Workout Endpoints
- GET /api/workouts
- POST /api/workouts
- PUT /api/workouts/:id
- DELETE /api/workouts/:id

## Development Rules

1. **Code Organization**
   - Follow MVC pattern
   - Use dependency injection
   - Implement service layer

2. **API Design**
   - RESTful principles
   - Consistent error responses
   - Input validation

3. **Security Practices**
   - Implement rate limiting
   - Validate JWT tokens
   - Sanitize inputs

4. **Error Handling**
   - Custom error classes
   - Centralized error handling
   - Detailed logging

## Database Guidelines

1. **Schema Design**
   - Use proper data types
   - Implement validation
   - Set appropriate indexes

2. **Query Optimization**
   - Use lean queries
   - Implement pagination
   - Proper indexing

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run lint`: Run ESLint

## Testing Strategy

1. **Unit Tests**
   - Controller logic
   - Service functions
   - Utility functions

2. **Integration Tests**
   - API endpoints
   - Database operations
   - Authentication flow

## Deployment

1. **Prerequisites**
   - Node.js environment
   - MongoDB instance
   - Environment variables

2. **Build Process**
   ```bash
   npm run build
   ```

3. **Production Start**
   ```bash
   npm start
   ```

## Monitoring and Logging

- Use Winston for logging
- Implement request tracking
- Monitor performance metrics

## Best Practices

1. **Code Quality**
   - Follow TypeScript best practices
   - Document complex logic
   - Use meaningful variable names

2. **Security**
   - Hash passwords
   - Validate user input
   - Implement rate limiting

3. **Performance**
   - Cache when possible
   - Optimize database queries
   - Use appropriate indexes 