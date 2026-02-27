import mongoose from 'mongoose';

const testDbUri = process.env.MONGODB_URI;

beforeAll(async () => {
  jest.setTimeout(30000);
  await mongoose.connect(testDbUri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
