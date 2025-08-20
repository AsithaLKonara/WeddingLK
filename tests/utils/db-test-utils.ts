import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

export const connectTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
};

export const disconnectTestDB = async () => {
  await mongoose.disconnect();
  await mongod.stop();
};

export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export const createTestData = async () => {
  // Create test users
  const User = mongoose.model('User', new mongoose.Schema({
    email: String,
    name: String,
    role: String,
    password: String,
  }));

  const testUser = new User({
    email: 'test@example.com',
    name: 'Test User',
    role: 'couple',
    password: 'hashedpassword',
  });

  await testUser.save();

  // Create test vendor
  const Vendor = mongoose.model('Vendor', new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    businessName: String,
    category: String,
    isVerified: Boolean,
  }));

  const testVendor = new Vendor({
    userId: testUser._id,
    businessName: 'Test Business',
    category: 'photography',
    isVerified: true,
  });

  await testVendor.save();

  return { testUser, testVendor };
};

export const cleanupTestData = async () => {
  await clearTestDB();
}; 