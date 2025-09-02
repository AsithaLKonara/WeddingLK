// Simple in-memory database for demo purposes
// This replaces MongoDB for free deployment

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'vendor' | 'planner' | 'admin';
  createdAt: Date;
}

interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  price: number;
  rating: number;
  image: string;
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  price: number;
  image: string;
}

// In-memory storage
let users: User[] = [];
let venues: Venue[] = [];
let vendors: Vendor[] = [];

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@weddinglk.com',
    name: 'Demo User',
    role: 'user',
    createdAt: new Date(),
  },
];

const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Grand Ballroom',
    location: 'Colombo',
    capacity: 200,
    price: 50000,
    rating: 4.5,
    image: '/images/venue1.jpg',
  },
  {
    id: '2',
    name: 'Garden Pavilion',
    location: 'Kandy',
    capacity: 150,
    price: 35000,
    rating: 4.2,
    image: '/images/venue2.jpg',
  },
];

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Elegant Photography',
    category: 'Photography',
    location: 'Colombo',
    rating: 4.8,
    price: 25000,
    image: '/images/vendor1.jpg',
  },
  {
    id: '2',
    name: 'Royal Catering',
    category: 'Catering',
    location: 'Kandy',
    rating: 4.6,
    price: 15000,
    image: '/images/vendor2.jpg',
  },
];

// Initialize with mock data
users = [...mockUsers];
venues = [...mockVenues];
vendors = [...mockVendors];

// Database functions
export const db = {
  // Users
  users: {
    findOne: (query: any) => {
      return users.find(user => 
        Object.keys(query).every(key => user[key as keyof User] === query[key])
      ) || null;
    },
    find: (query: any = {}) => {
      if (Object.keys(query).length === 0) return users;
      return users.filter(user => 
        Object.keys(query).every(key => user[key as keyof User] === query[key])
      );
    },
    create: (data: Omit<User, 'id' | 'createdAt'>) => {
      const user: User = {
        id: (users.length + 1).toString(),
        ...data,
        createdAt: new Date(),
      };
      users.push(user);
      return user;
    },
    updateOne: (query: any, update: any) => {
      const index = users.findIndex(user => 
        Object.keys(query).every(key => user[key as keyof User] === query[key])
      );
      if (index !== -1) {
        users[index] = { ...users[index], ...update };
        return users[index];
      }
      return null;
    },
  },

  // Venues
  venues: {
    find: (query: any = {}) => {
      if (Object.keys(query).length === 0) return venues;
      return venues.filter(venue => 
        Object.keys(query).every(key => venue[key as keyof Venue] === query[key])
      );
    },
    findById: (id: string) => {
      return venues.find(venue => venue.id === id) || null;
    },
    create: (data: Omit<Venue, 'id'>) => {
      const venue: Venue = {
        id: (venues.length + 1).toString(),
        ...data,
      };
      venues.push(venue);
      return venue;
    },
  },

  // Vendors
  vendors: {
    find: (query: any = {}) => {
      if (Object.keys(query).length === 0) return vendors;
      return vendors.filter(vendor => 
        Object.keys(query).every(key => vendor[key as keyof Vendor] === query[key])
      );
    },
    findById: (id: string) => {
      return vendors.find(vendor => vendor.id === id) || null;
    },
    create: (data: Omit<Vendor, 'id'>) => {
      const vendor: Vendor = {
        id: (vendors.length + 1).toString(),
        ...data,
      };
      vendors.push(vendor);
      return vendor;
    },
  },
};

// Connection function (compatible with MongoDB)
export const connectDB = async () => {
  console.log('Connected to in-memory database');
  return true;
};

export default db;
