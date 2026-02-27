import mongoose from 'mongoose';

describe('Database Integration Tests', () => {
  describe('User Model', () => {
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true, trim: true, maxlength: 100 },
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true, select: false },
      role: { type: String, enum: ['buyer', 'seller', 'agent', 'admin'], default: 'buyer' },
      isVerified: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
      isDeleted: { type: Boolean, default: false, index: true },
      deletedAt: Date,
    }, { timestamps: true });

    const User = mongoose.model('User', userSchema);

    it('should create a user successfully', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword123',
        role: 'buyer'
      });

      expect(user._id).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });

    it('should enforce unique email', async () => {
      await User.create({
        name: 'User One',
        email: 'duplicate@test.com',
        password: 'password123'
      });

      await expect(User.create({
        name: 'User Two',
        email: 'duplicate@test.com',
        password: 'password456'
      })).rejects.toThrow();
    });
  });

  describe('Property Model', () => {
    const propertySchema = new mongoose.Schema({
      title: { type: String, required: true, trim: true },
      slug: { type: String, unique: true, index: true },
      description: { type: String },
      type: { type: String, enum: ['apartment', 'villa', 'studio', 'office', 'land'], index: true },
      status: { type: String, enum: ['draft', 'active', 'sold', 'rented', 'archived'], default: 'draft', index: true },
      price: { type: Number, required: true, index: true },
      priceType: { type: String, enum: ['sale', 'rent'], index: true },
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number] },
        city: { type: String, index: true }
      },
      owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
      isDeleted: { type: Boolean, default: false, index: true },
      deletedAt: Date
    }, { timestamps: true });

    propertySchema.index({ location: '2dsphere' });

    const Property = mongoose.model('Property', propertySchema);

    it('should create a property with GeoJSON', async () => {
      const property = await Property.create({
        title: 'Luxury Villa',
        slug: 'luxury-villa-1',
        type: 'villa',
        status: 'active',
        price: 500000,
        priceType: 'sale',
        location: {
          type: 'Point',
          coordinates: [-73.935242, 40.730610],
          city: 'New York'
        }
      });

      expect(property._id).toBeDefined();
      expect(property.location.type).toBe('Point');
    });
  });

  describe('Offer Model', () => {
    const offerSchema = new mongoose.Schema({
      property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
      buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
      amount: { type: Number, required: true },
      status: { type: String, enum: ['pending', 'countered', 'accepted', 'rejected', 'withdrawn'], default: 'pending', index: true },
      isDeleted: { type: Boolean, default: false }
    }, { timestamps: true });

    offerSchema.index({ property: 1, buyer: 1 });

    const Offer = mongoose.model('Offer', offerSchema);

    it('should create an offer', async () => {
      const offer = await Offer.create({
        property: new mongoose.Types.ObjectId(),
        buyer: new mongoose.Types.ObjectId(),
        amount: 450000,
        status: 'pending'
      });

      expect(offer._id).toBeDefined();
      expect(offer.amount).toBe(450000);
    });
  });

  describe('Booking Model', () => {
    const bookingSchema = new mongoose.Schema({
      property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
      buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
      scheduledDate: { type: Date, required: true, index: true },
      status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'], default: 'pending' }
    }, { timestamps: true });

    bookingSchema.index({ property: 1, scheduledDate: 1 });

    const Booking = mongoose.model('Booking', bookingSchema);

    it('should create a booking', async () => {
      const booking = await Booking.create({
        property: new mongoose.Types.ObjectId(),
        buyer: new mongoose.Types.ObjectId(),
        scheduledDate: new Date(Date.now() + 86400000),
        status: 'pending'
      });

      expect(booking._id).toBeDefined();
    });
  });

  describe('Review Model', () => {
    const reviewSchema = new mongoose.Schema({
      property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: String
    }, { timestamps: true });

    reviewSchema.index({ property: 1, user: 1 }, { unique: true });

    const Review = mongoose.model('Review', reviewSchema);

    it('should enforce one review per user per property', async () => {
      const propertyId = new mongoose.Types.ObjectId();
      const userId = new mongoose.Types.ObjectId();

      await Review.create({ property: propertyId, user: userId, rating: 5 });

      await expect(Review.create({ property: propertyId, user: userId, rating: 4 })).rejects.toThrow();
    });
  });

  describe('Favorite Model', () => {
    const favoriteSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
      property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', index: true }
    }, { timestamps: true });

    favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

    const Favorite = mongoose.model('Favorite', favoriteSchema);

    it('should prevent duplicate favorites', async () => {
      const userId = new mongoose.Types.ObjectId();
      const propertyId = new mongoose.Types.ObjectId();

      await Favorite.create({ user: userId, property: propertyId });
      await expect(Favorite.create({ user: userId, property: propertyId })).rejects.toThrow();
    });
  });

  describe('Notification Model', () => {
    const notificationSchema = new mongoose.Schema({
      recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
      type: { type: String, enum: ['new_offer', 'offer_status', 'booking_confirmed'], required: true, index: true },
      title: { type: String, required: true },
      message: { type: String, required: true },
      isRead: { type: Boolean, default: false, index: true },
      isDeleted: { type: Boolean, default: false }
    }, { timestamps: true });

    notificationSchema.index({ recipient: 1, isRead: 1 });

    const Notification = mongoose.model('Notification', notificationSchema);

    it('should create a notification', async () => {
      const notification = await Notification.create({
        recipient: new mongoose.Types.ObjectId(),
        type: 'new_offer',
        title: 'New Offer',
        message: 'You received a new offer'
      });

      expect(notification._id).toBeDefined();
      expect(notification.isRead).toBe(false);
    });
  });

  describe('Analytics Model', () => {
    const analyticsSchema = new mongoose.Schema({
      entityType: { type: String, enum: ['property', 'user'], required: true, index: true },
      entityId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
      eventType: { type: String, enum: ['view', 'favorite', 'search'], required: true, index: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }
    }, { timestamps: true });

    analyticsSchema.index({ entityType: 1, entityId: 1, eventType: 1 });

    const Analytics = mongoose.model('Analytics', analyticsSchema);

    it('should track property view', async () => {
      const event = await Analytics.create({
        entityType: 'property',
        entityId: new mongoose.Types.ObjectId(),
        eventType: 'view',
        userId: new mongoose.Types.ObjectId()
      });

      expect(event._id).toBeDefined();
      expect(event.eventType).toBe('view');
    });
  });
});
