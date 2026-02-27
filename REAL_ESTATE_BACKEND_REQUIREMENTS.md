# Real Estate Backend Requirements

## 1. Project Vision

This backend system aims to be architecturally comparable to industry-leading platforms like Airbnb, Zillow, and Redfin in terms of scalability, engineering quality, and system design. The platform will serve as a comprehensive real estate marketplace supporting property listings, user interactions, booking management, and analytics while maintaining FAANG-level engineering standards.

The system is designed to handle high-volume traffic, support multiple user roles, and provide a robust foundation for future scalability into a distributed architecture.

## Project Structure

```
real-estate-backend/
│
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── env.js
│   │   ├── database.js
│   │   └── rateLimiter.js
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── properties/
│   │   ├── offers/
│   │   ├── bookings/
│   │   ├── reviews/
│   │   ├── favorites/
│   │   ├── notifications/
│   │   └── analytics/
│   ├── shared/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── types/
│   │   └── errors/
├── .env
├── package.json
└── jsconfig.json
```

### Module Structure

Each module follows the Controller → Service → Repository pattern:

```
modules/[module-name]/
├── [module].controller.js
├── [module].service.js
├── [module].repository.js
├── [module].model.js
├── [module].routes.js
├── [module].validation.js
└── __tests__/
    ├── [module].controller.test.js
    ├── [module].service.test.js
    └── [module].repository.test.js
```

### Shared Components

```
shared/
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── roleGuard.js
├── utils/
│   ├── logger.js
│   ├── email.js
│   ├── upload.js
│   └── helpers.js
├── constants/
│   ├── roles.js
│   ├── status.js
│   └── errors.js
├── types/
│   ├── user.types.js
│   ├── property.types.js
│   └── common.types.js
└── errors/
    ├── AppError.js
    ├── ValidationError.js
    └── DatabaseError.js
```

## 2. Architecture Principles

### Core Design Patterns

- **Modular Monolith**: Self-contained modules with clear boundaries, enabling future microservice extraction
- **Controller → Service → Repository**: Strict separation of concerns across layers
- **Dependency Injection**: Loose coupling between components

### Data Management

- **Soft Deletes Everywhere**: All entities support soft deletion with `isDeleted` and `deletedAt` fields
- **Proper Indexing Strategy**: Optimized database indexes for query performance
- **Immutable Audit Trails**: Created/updated timestamps on all entities
- **GeoJSON Support**: 2dsphere indexing for location-based queries

### System Architecture

- **Centralized Error Handling**: Global error middleware with consistent error responses
- **Validation Layer**: Input validation using Joi or similar schema validation
- **Role-Based Authorization**: Granular access control based on user roles
- **Cursor-Based Pagination**: Efficient pagination for large datasets

## 3. Feature Requirements

### Authentication & Authorization

#### Core Authentication Features

- **User Registration**: Email/password signup with validation
- **User Login**: JWT-based authentication with refresh tokens
- **User Logout**: Token invalidation and session cleanup
- **Password Reset**: Secure email-based password recovery flow
- **Email Verification**: Account verification via email confirmation

#### Authorization System

- **JWT Access Tokens**: Short-lived access tokens with proper expiration
- **Role-Based Access Control**: Four primary roles:
  - `buyer`: Can browse properties, make offers, schedule tours
  - `seller`: Can list properties, manage offers, respond to bookings
  - `agent`: Enhanced seller capabilities with client management
  - `admin`: Full system access and user management

### Users Module

#### Profile Management

- **Profile Updates**: Edit personal information, contact details, preferences
- **Avatar Management**: Profile image upload and management
- **Soft Delete**: User account deactivation with data preservation
- **Admin User Management**: Administrative CRUD operations on user accounts

#### Agent Features

- **Agent Rating System**: Cumulative rating based on client reviews
- **License Verification**: Agent credential validation
- **Performance Metrics**: Transaction history and success rates

### Properties Module

#### Property Management

- **CRUD Operations**: Create, read, update, delete properties
- **Draft vs Active Listing**: Save drafts before publishing
- **GeoJSON Location**: Precise geospatial data for mapping
- **Media Management**: Multiple images, videos, virtual tours

#### Search & Discovery

- **Full Filtering System**:
  - Price range (min/max)
  - Property type (house, apartment, condo, etc.)
  - Bedrooms/bathrooms count
  - Square footage range
  - Amenities (parking, pool, gym, etc.)
  - Property status (for sale, for rent, etc.)
- **Sorting Options**: Price (asc/desc), newest first, popularity, relevance
- **Text Search**: Full-text search across title, description, features
- **Location-Based Search**: Proximity search with radius filtering

#### Engagement Features

- **View Tracking**: Analytics for property views and interactions
- **Favorites Counter**: Real-time count of user favorites
- **Featured Properties**: Admin-curated property highlights
- **Boost Score System**: Algorithm for property visibility and ranking
- **Soft Delete**: Remove listings while preserving historical data

### Offers Module

#### Offer Management

- **Create Offer**: Submit purchase/rental offers with terms
- **Counter Offer**: Negotiation workflow between parties
- **Offer Actions**: Accept, reject, or withdraw offers
- **Duplicate Prevention**: Block multiple active offers from same user
- **Offer History**: Complete audit trail of all offer interactions

### Bookings Module

#### Tour Scheduling

- **Schedule Tour**: Book property viewings with time slots
- **Approval Workflow**: Seller/agent approval system
- **Conflict Prevention**: Prevent overlapping bookings
- **Calendar Integration**: Sync with external calendars
- **Booking Status**: Pending, approved, rejected, completed, cancelled

### Reviews Module

#### Review System

- **One Review Per User Per Property**: Enforce uniqueness constraint
- **Rating System**: 1-5 star ratings with detailed feedback
- **Automatic Rating Recalculation**: Update property/agent averages
- **Review Moderation**: Admin review and content moderation
- **Review Responses**: Property owner/agent reply functionality

### Favorites Module

#### Wishlist Management

- **Add/Remove Favorites**: Toggle property favorites
- **Unique Compound Index**: (user + property) constraint
- **Favorite Lists**: Organize favorites into custom lists
- **Share Favorites**: Export or share favorite collections

### Notifications Module

#### Notification System

- **Database Storage**: Persistent notification storage
- **Read/Unread Status**: Track notification acknowledgment
- **Notification Types**:
  - New offers received
  - Offer status changes
  - Booking confirmations
  - Property updates
  - System announcements
- **Delivery Channels**: In-app, email, push notification ready

### Analytics Module

#### Property Analytics

- **View Tracking**: Detailed property view analytics
- **Popularity Score Logic**: Algorithm based on views, favorites, offers
- **Engagement Metrics**: Time-on-page, bounce rates, conversion rates
- **Market Trends**: Price trends, demand analysis

#### Admin Dashboard

- **System Metrics**: User growth, property listings, transaction volume
- **Performance Analytics**: Response times, error rates, system health
- **Business Intelligence**: Revenue tracking, market insights
- **User Behavior**: Activity patterns, feature usage statistics

## 4. Security Requirements

### Application Security

- **Rate Limiting**: Configurable rate limits by endpoint and user role
- **Helmet.js**: Security headers for HTTP protection
- **XSS Sanitization**: Input sanitization and output encoding
- **MongoDB Injection Prevention**: Parameterized queries and input validation
- **CORS Configuration**: Proper cross-origin resource sharing setup

### Authentication Security

- **JWT Verification Middleware**: Token validation and refresh logic
- **Role Guard Middleware**: Authorization checks based on user roles
- **Password Security**: Bcrypt hashing with proper salt rounds
- **Session Management**: Secure token storage and invalidation

### Data Protection

- **Input Validation**: Comprehensive schema validation
- **Data Encryption**: Sensitive data encryption at rest
- **Audit Logging**: Track all data modifications
- **Privacy Controls**: GDPR compliance features

## 5. Performance Requirements

### Database Optimization

- **Proper DB Indexes**: Strategic indexing for common query patterns
- **Query Optimization**: Efficient query design and execution plans
- **Avoid N+1 Problems**: Proper data loading strategies
- **Projection Usage**: Selective field retrieval for large responses
- **Connection Pooling**: Efficient database connection management

### API Performance

- **Pagination Required**: All listing endpoints must implement pagination
- **Response Compression**: Gzip compression for API responses
- **Async Processing**: Non-blocking I/O operations
- **Load Balancing Ready**: Horizontal scaling preparation

## 6. Coding Standards

### Architecture Standards

- **No Business Logic in Controllers**: Controllers only handle HTTP concerns
- **Services Handle Business Rules**: All business logic in service layer
- **Repositories Handle DB Only**: Data access abstraction
- **Async Handler Wrapper**: Consistent async error handling
- **Custom Error Classes**: Typed error handling with proper inheritance

### Code Quality

- **Consistent Response Format**: Standardized API response structure
- **Error Handling**: Comprehensive error catching and logging
- **Code Organization**: Clear file naming and structure conventions
- **Documentation**: Inline documentation for complex logic

## 7. Database Modeling Standards

### Standard Fields

- **Timestamps**: `createdAt`, `updatedAt` on all entities
- **Soft Delete**: `isDeleted` boolean, `deletedAt` timestamp
- **Audit Fields**: `createdBy`, `updatedBy` where applicable
- **Version Control**: `__v` field for document versioning

### Indexing Strategy

- **Foreign Keys**: Indexed references for fast joins
- **Unique Constraints**: Enforce data integrity
- **Compound Indexes**: Multi-field indexes for complex queries
- **2dsphere Index**: Location-based query optimization
- **Text Indexes**: Full-text search capabilities

### Data Relationships

- **Referential Integrity**: Proper relationship modeling
- **Cascade Operations**: Appropriate cascade delete/update rules
- **Population Strategy**: Efficient data loading patterns
- **Normalization Balance**: Optimal normalization level

## 8. API Design Standards

### RESTful Architecture

- **Resource-Based Routes**: Clear, intuitive endpoint design
- **HTTP Method Compliance**: Proper GET, POST, PUT, PATCH, DELETE usage
- **Status Code Standards**: Correct HTTP status codes for all scenarios
- **Versioned API**: `/api/v1` prefix for version management

### Response Standards

- **Structured JSON Responses**: Consistent response envelope format
- **Error Response Format**: Standardized error structure
- **Success Response Format**: Uniform success response schema
- **Metadata Inclusion**: Pagination info, timestamps, etc.

### Endpoint Examples

```
GET    /api/v1/properties
POST   /api/v1/properties
GET    /api/v1/properties/:id
PUT    /api/v1/properties/:id
DELETE /api/v1/properties/:id

GET    /api/v1/users/profile
PUT    /api/v1/users/profile
GET    /api/v1/users/:id

POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
```

## 10. Database Model Examples

### User Model (Production Ready)

**modules/users/user.model.js**

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "agent", "admin"],
      default: "buyer",
      index: true,
    },

    phone: String,

    avatar: String,

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    averageRating: {
      type: Number,
      default: 0,
    },

    ratingsCount: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: Date,
  },
  { timestamps: true },
);

userSchema.index({ role: 1, averageRating: -1 });

module.exports = mongoose.model("User", userSchema);
```

### Property Model (Core of the System)

**modules/properties/property.model.js**

```javascript
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: "text",
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      index: "text",
    },

    type: {
      type: String,
      enum: ["apartment", "villa", "studio", "office", "land"],
      index: true,
    },

    status: {
      type: String,
      enum: ["draft", "active", "sold", "rented", "archived"],
      default: "draft",
      index: true,
    },

    price: {
      type: Number,
      required: true,
      index: true,
    },

    priceType: {
      type: String,
      enum: ["sale", "rent"],
      index: true,
    },

    currency: {
      type: String,
      default: "USD",
    },

    area: Number,
    bedrooms: { type: Number, index: true },
    bathrooms: { type: Number, index: true },

    amenities: [String],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
      address: String,
      city: { type: String, index: true },
      country: String,
    },

    images: [String],
    coverImage: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    ratingsCount: {
      type: Number,
      default: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
      index: true,
    },

    favoritesCount: {
      type: Number,
      default: 0,
    },

    boostScore: {
      type: Number,
      default: 0,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: Date,
  },
  { timestamps: true },
);

propertySchema.index({ location: "2dsphere" });
propertySchema.index({ price: 1, bedrooms: 1 });
propertySchema.index({ city: 1, price: 1 });

module.exports = mongoose.model("Property", propertySchema);
```

### Offer Model

**modules/offers/offer.model.js**

```javascript
const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "countered", "accepted", "rejected", "withdrawn"],
      default: "pending",
      index: true,
    },

    expiresAt: Date,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

offerSchema.index({ property: 1, buyer: 1 });

module.exports = mongoose.model("Offer", offerSchema);
```

### Booking / Tour Request Model

**modules/bookings/booking.model.js**

```javascript
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "cancelled"],
      default: "pending",
    },

    message: String,
  },
  { timestamps: true },
);

bookingSchema.index({ property: 1, scheduledDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
```

### Review Model

**modules/reviews/review.model.js**

```javascript
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: String,
  },
  { timestamps: true },
);

reviewSchema.index({ property: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
```

### Favorite Model

**modules/favorites/favorite.model.js**

```javascript
const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      index: true,
    },
  },
  { timestamps: true },
);

favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
```

### Notification Model

**modules/notifications/notification.model.js**

```javascript
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "new_offer",
        "offer_status",
        "booking_confirmed",
        "booking_cancelled",
        "property_update",
        "system_announcement",
      ],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    relatedEntity: {
      entityType: String,
      entityId: mongoose.Schema.Types.ObjectId,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
```

### Analytics Model

**modules/analytics/analytics.model.js**

```javascript
const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ["property", "user"],
      required: true,
      index: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    eventType: {
      type: String,
      enum: ["view", "favorite", "offer_created", "booking_created", "search"],
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    metadata: {
      userAgent: String,
      ipAddress: String,
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: [Number],
      },
      searchQuery: String,
      filters: Object,
    },
  },
  { timestamps: true },
);

analyticsSchema.index({ entityType: 1, entityId: 1, eventType: 1 });
analyticsSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
```

---

## Implementation Priority

### Phase 1: Core Foundation

1. Authentication & Authorization system
2. User management with profiles
3. Basic property CRUD operations
4. Database setup and indexing

### Phase 2: Core Features

1. Property search and filtering
2. Offer management system
3. Booking and tour scheduling
4. Review and rating system

### Phase 3: Advanced Features

1. Favorites and wishlist management
2. Notification system
3. Analytics and reporting
4. Admin dashboard functionality

This requirements document serves as the foundation for building a production-ready, scalable real estate backend system that meets enterprise-grade standards and supports future growth.
