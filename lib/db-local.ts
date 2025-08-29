// Local Database Configuration for WeddingLK
// Uses JSON files for local data storage

import fs from 'fs';
import path from 'path';
import {
  User,
  Venue,
  Vendor,
  Booking,
  Payment,
  Review,
  Message,
  Task,
} from './types';

export interface DatabaseConfig {
  users: User[];
  venues: Venue[];
  vendors: Vendor[];
  bookings: Booking[];
  payments: Payment[];
  reviews: Review[];
  messages: Message[];
  tasks: Task[];
}

// Database file path
const DB_FILE_PATH = path.join(process.cwd(), 'data', 'local-database.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(DB_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize empty database
const initializeDatabase = (): DatabaseConfig => ({
  users: [],
  venues: [],
  vendors: [],
  bookings: [],
  payments: [],
  reviews: [],
  messages: [],
  tasks: [],
});

// Load database from file
export const loadDatabase = (): DatabaseConfig => {
  try {
    ensureDataDirectory();

    if (!fs.existsSync(DB_FILE_PATH)) {
      const initialDb = initializeDatabase();
      saveDatabase(initialDb);
      return initialDb;
    }

    const data = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading database:', error);
    return initializeDatabase();
  }
};

// Save database to file
export const saveDatabase = (data: DatabaseConfig): void => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// Database operations
export class LocalDatabase {
  private data: DatabaseConfig;

  constructor() {
    this.data = loadDatabase();
  }

  // Generic CRUD operations
  async create<T extends keyof DatabaseConfig>(
    collection: T,
    item: DatabaseConfig[T][0]
  ): Promise<DatabaseConfig[T][0]> {
    const newItem = { ...item, _id: this.generateId() };
    this.data[collection].push(newItem as any);
    saveDatabase(this.data);
    return newItem as DatabaseConfig[T][0];
  }

  async find<T extends keyof DatabaseConfig>(
    collection: T,
    query: Partial<DatabaseConfig[T][0]> = {}
  ): Promise<DatabaseConfig[T][0][]> {
    return this.data[collection].filter(item =>
      Object.keys(query).every(
        key => (item as any)[key] === (query as any)[key]
      )
    ) as DatabaseConfig[T][0][];
  }

  async findById<T extends keyof DatabaseConfig>(
    collection: T,
    id: string
  ): Promise<DatabaseConfig[T][0] | null> {
    const item = this.data[collection].find((item: any) => item._id === id);
    return (item as DatabaseConfig[T][0]) || null;
  }

  async update<T extends keyof DatabaseConfig>(
    collection: T,
    id: string,
    updates: Partial<DatabaseConfig[T][0]>
  ): Promise<DatabaseConfig[T][0] | null> {
    const index = this.data[collection].findIndex(
      (item: any) => item._id === id
    );
    if (index === -1) return null;

    this.data[collection][index] = {
      ...this.data[collection][index],
      ...updates,
    } as any;
    saveDatabase(this.data);
    return this.data[collection][index] as DatabaseConfig[T][0];
  }

  async delete<T extends keyof DatabaseConfig>(
    collection: T,
    id: string
  ): Promise<boolean> {
    const index = this.data[collection].findIndex(
      (item: any) => item._id === id
    );
    if (index === -1) return false;

    this.data[collection].splice(index, 1);
    saveDatabase(this.data);
    return true;
  }

  async count<T extends keyof DatabaseConfig>(collection: T): Promise<number> {
    return this.data[collection].length;
  }

  // Generate unique ID
  private generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get all data
  getAllData(): DatabaseConfig {
    return this.data;
  }

  // Reset database
  reset(): void {
    this.data = initializeDatabase();
    saveDatabase(this.data);
  }
}

// Export singleton instance
export const localDb = new LocalDatabase();
