# AGENTS.md - Real Estate Backend Development Guide

## Project Overview

This is a modular monolith Node.js/Express backend for a real estate marketplace, following a **Controller → Service → Repository** pattern. The project uses MongoDB with Mongoose ODM.

## Build & Development Commands

### Installation & Setup

```bash
npm install          # Install all dependencies
npm run dev         # Start development server with nodemon
npm start           # Start production server
```

### Running Tests

```bash
npm test            # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Run a single test file
npm test -- --testPathPattern="users.controller.test.js"

# Run a specific test
npm test -- --testNamePattern="should create user"
```

### Linting & Code Quality

```bash
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues automatically
npm run format      # Format code with Prettier
```

### Database

```bash
npm run db:migrate  # Run database migrations
npm run db:seed     # Seed database with sample data
npm run db:drop     # Drop all database collections
```

---

## Architecture Patterns

### Module Structure (Required)

Each feature module follows this exact structure:

```
modules/[module-name]/
├── [module].controller.js   # HTTP layer - req/res handling ONLY
├── [module].service.js      # Business logic
├── [module].repository.js   # Data access layer
├── [module].model.js        # Mongoose schema
├── [module].routes.js       # Express routes
├── [module].validation.js  # Joi/Zod validation schemas
└── __tests__/
    ├── [module].controller.test.js
    ├── [module].service.test.js
    └── [module].repository.test.js
```

### Layer Responsibilities

| Layer | Responsibility | Should NOT contain |
|-------|---------------|-------------------|
| Controller | Parse request, validate input, call service, format response | Business logic, DB queries |
| Service | Business rules, data transformation, coordination | HTTP code, direct DB access |
| Repository | Database queries, data retrieval | Business logic, HTTP code |

### Shared Components Location

```
src/shared/
├── middleware/     # auth, validation, errorHandler, rateLimiter, roleGuard
├── utils/         # logger, email, upload, helpers
├── constants/    # roles, status, errors
├── types/        # user.types, property.types, common.types
└── errors/       # AppError, ValidationError, DatabaseError
```

---

## Code Style Guidelines

### General Principles

- **No business logic in controllers** - Controllers only handle HTTP concerns
- **Always use async/await** - Never use callback-style code
- **Always use try/catch** in async functions or use asyncHandler wrapper
- **Never expose sensitive data** - Use `select: false` for passwords, tokens

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files | kebab-case | `user.controller.js` |
| Models | PascalCase | `User`, `Property` |
| Variables | camelCase | `isActive`, `createdAt` |
| Constants | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| Database fields | snake_case | `is_deleted`, `created_at` |
| Routes | kebab-case | `/api/v1/user-profile` |
| Controller methods | camelCase | `getUserProfile` |

### Imports & Exports

```javascript
// Use absolute imports from src/ (configure in jsconfig.json)
const { UserService } = require('@services/user.service');
const User = require('@models/user.model');
const AppError = require('@errors/AppError');

// Export multiple
module.exports = { UserController, UserService };

// Or use named exports
exports.UserController = class UserController {};
```

### Response Format

**Success Response:**
```javascript
res.status(200).json({
  success: true,
  message: 'Operation successful',
  data: { /* payload */ },
  meta: { /* pagination, timestamps */ }
});
```

**Error Response:**
```javascript
res.status(400).json({
  success: false,
  message: 'Error description',
  error: { code: 'ERROR_CODE', details: {} }
});
```

### Error Handling

```javascript
// Always throw custom errors with proper codes
throw new AppError('User not found', 404, 'USER_NOT_FOUND');

// Use asyncHandler wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Controller example
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await UserService.getById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.success(user);
});
```

---

## Database Standards

### Required Fields (All Models)

Every MongoDB document must include:

```javascript
{
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Indexing Strategy

- Always index foreign key references (`ref` fields)
- Create compound indexes for common query patterns
- Use `2dsphere` index for GeoJSON location queries
- Use `text` indexes for full-text search fields

### Queries

```javascript
// Always filter out deleted records
const query = { isDeleted: false };

// Use select for projection
const user = await User.findById(id).select('-password');

// Use lean() for read-only queries
const users = await User.find({ role: 'buyer' }).lean();
```

---

## API Design Standards

### RESTful Conventions

- Use `/api/v1/` prefix for all endpoints
- Resource-based routes: `/properties`, `/users`, `/offers`
- Use proper HTTP methods: GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove)
- Use plural nouns: `/properties` not `/property`

### Pagination (Required for All List Endpoints)

```javascript
// Use cursor-based or offset pagination
const { page = 1, limit = 20 } = req.query;
const skip = (page - 1) * limit;

const [data, total] = await Promise.all([
  Model.find(query).skip(skip).limit(limit),
  Model.countDocuments(query)
]);

res.success(data, { pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
```

### Status Codes

| Code | Usage |
|------|-------|
| 200 | Successful GET, PUT, PATCH |
| 201 | Successful POST (created) |
| 204 | Successful DELETE (no content) |
| 400 | Validation error, bad request |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 409 | Conflict (duplicate entry) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Testing Guidelines

### Test Structure

```javascript
describe('UserController', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      const userData = { name: 'Test', email: 'test@example.com', password: 'password123' };
      const result = await UserController.createUser(mockReq, mockRes);
      
      expect(result.status).toBe(201);
      expect(result.data.email).toBe('test@example.com');
    });

    it('should throw validation error for invalid email', async () => {
      await expect(UserController.createUser(invalidReq, mockRes))
        .rejects.toThrow(ValidationError);
    });
  });
});
```

### Test Conventions

- Use `__tests__/` directory within each module
- Name test files: `[module].controller.test.js`, `[module].service.test.js`
- Use `describe` blocks for grouping related tests
- Use meaningful test descriptions: "should return 401 when token is invalid"
- Mock external dependencies (database, email, etc.)
- Use `beforeEach` for setup and `afterEach` for cleanup

---

## Validation Standards

### Input Validation Rules

- Validate ALL user input on the server side (never trust client)
- Use Joi or Zod for schema validation
- Return specific validation errors with field-level details

```javascript
// validation/user.validation.js
const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid('buyer', 'seller', 'agent', 'admin')
});

exports.validateCreateUser = (data) => createUserSchema.validate(data, { abortEarly: false });
```

---

## Security Guidelines

### Authentication & Authorization

- Use JWT with short expiration (15 min access, 7 days refresh)
- Hash passwords with bcrypt (12 salt rounds)
- Implement rate limiting on auth endpoints
- Use Helmet.js for security headers

### Data Protection

- Never log sensitive data (passwords, tokens, PII)
- Sanitize user input to prevent injection
- Use parameterized queries (Mongoose handles this)
- Implement CORS properly

---

## Git Conventions

### Commit Messages

```
feat: add user profile update endpoint
fix: resolve property search pagination issue  
docs: update API documentation
refactor: extract notification logic to service
test: add unit tests for booking controller
```

### Branch Naming

```
feature/add-property-search-filter
bugfix/fix-offer-duplicate-error
hotfix/security-patch
```

---

## File Templates

### Controller Template

```javascript
const asyncHandler = require('@middleware/asyncHandler');
const { UserService } = require('./user.service');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const { page, limit, ...filters } = req.query;
  const result = await UserService.getAll({ page, limit, ...filters });
  res.success(result.data, result.meta);
});

exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await UserService.getById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.success(user);
});
```

### Service Template

```javascript
const User = require('@models/user.model');
const AppError = require('@errors/AppError');

class UserService {
  static async getById(id) {
    const user = await User.findOne({ _id: id, isDeleted: false }).select('-password');
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  static async create(data) {
    const existing = await User.findOne({ email: data.email, isDeleted: false });
    if (existing) throw new AppError('Email already exists', 409);
    
    const user = await User.create(data);
    return user;
  }
}

module.exports = { UserService };
```

---

## Environment Variables

Required environment variables (`.env`):

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/real-estate
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## Project Modules

The following modules should be implemented:

1. **auth** - JWT authentication, registration, login, password reset
2. **users** - User profiles, admin management, agent features
3. **properties** - Property CRUD, search, filtering, geo queries
4. **offers** - Offer creation, negotiation, status management
5. **bookings** - Tour scheduling, approval workflow
6. **reviews** - Ratings, reviews, moderation
7. **favorites** - Wishlist management
8. **notifications** - In-app notifications
9. **analytics** - View tracking, metrics
