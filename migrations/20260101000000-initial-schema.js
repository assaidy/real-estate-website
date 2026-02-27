module.exports = {
  async up(db) {
    console.log('Creating users collection...');
    await db.createCollection('users');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ isDeleted: 1 });
    await db.collection('users').createIndex({ isActive: 1 });

    console.log('Creating properties collection...');
    await db.createCollection('properties');
    await db.collection('properties').createIndex({ title: 'text', description: 'text' });
    await db.collection('properties').createIndex({ slug: 1 }, { unique: true });
    await db.collection('properties').createIndex({ type: 1 });
    await db.collection('properties').createIndex({ status: 1 });
    await db.collection('properties').createIndex({ price: 1 });
    await db.collection('properties').createIndex({ priceType: 1 });
    await db.collection('properties').createIndex({ bedrooms: 1 });
    await db.collection('properties').createIndex({ bathrooms: 1 });
    await db.collection('properties').createIndex({ city: 1 });
    await db.collection('properties').createIndex({ owner: 1 });
    await db.collection('properties').createIndex({ agent: 1 });
    await db.collection('properties').createIndex({ viewsCount: 1 });
    await db.collection('properties').createIndex({ boostScore: 1 });
    await db.collection('properties').createIndex({ isFeatured: 1 });
    await db.collection('properties').createIndex({ isDeleted: 1 });
    await db.collection('properties').createIndex({ location: '2dsphere' });
    await db.collection('properties').createIndex({ price: 1, bedrooms: 1 });
    await db.collection('properties').createIndex({ city: 1, price: 1 });
    await db.collection('properties').createIndex({ role: 1, averageRating: -1 });

    console.log('Creating offers collection...');
    await db.createCollection('offers');
    await db.collection('offers').createIndex({ property: 1 });
    await db.collection('offers').createIndex({ buyer: 1 });
    await db.collection('offers').createIndex({ status: 1 });
    await db.collection('offers').createIndex({ isDeleted: 1 });
    await db.collection('offers').createIndex({ property: 1, buyer: 1 });

    console.log('Creating bookings collection...');
    await db.createCollection('bookings');
    await db.collection('bookings').createIndex({ property: 1 });
    await db.collection('bookings').createIndex({ buyer: 1 });
    await db.collection('bookings').createIndex({ scheduledDate: 1 });
    await db.collection('bookings').createIndex({ property: 1, scheduledDate: 1 });

    console.log('Creating reviews collection...');
    await db.createCollection('reviews');
    await db.collection('reviews').createIndex({ property: 1 });
    await db.collection('reviews').createIndex({ user: 1 });
    await db.collection('reviews').createIndex({ property: 1, user: 1 }, { unique: true });

    console.log('Creating favorites collection...');
    await db.createCollection('favorites');
    await db.collection('favorites').createIndex({ user: 1 });
    await db.collection('favorites').createIndex({ property: 1 });
    await db.collection('favorites').createIndex({ user: 1, property: 1 }, { unique: true });

    console.log('Creating notifications collection...');
    await db.createCollection('notifications');
    await db.collection('notifications').createIndex({ recipient: 1 });
    await db.collection('notifications').createIndex({ type: 1 });
    await db.collection('notifications').createIndex({ isRead: 1 });
    await db.collection('notifications').createIndex({ isDeleted: 1 });
    await db.collection('notifications').createIndex({ recipient: 1, isRead: 1 });

    console.log('Creating analytics collection...');
    await db.createCollection('analytics');
    await db.collection('analytics').createIndex({ entityType: 1 });
    await db.collection('analytics').createIndex({ entityId: 1 });
    await db.collection('analytics').createIndex({ eventType: 1 });
    await db.collection('analytics').createIndex({ userId: 1 });
    await db.collection('analytics').createIndex({ createdAt: -1 });
    await db.collection('analytics').createIndex({ entityType: 1, entityId: 1, eventType: 1 });

    console.log('All collections and indexes created successfully!');
  },

  async down(db) {
    console.log('Dropping all collections...');
    await db.collection('users').drop();
    await db.collection('properties').drop();
    await db.collection('offers').drop();
    await db.collection('bookings').drop();
    await db.collection('reviews').drop();
    await db.collection('favorites').drop();
    await db.collection('notifications').drop();
    await db.collection('analytics').drop();
    console.log('All collections dropped successfully!');
  }
};
