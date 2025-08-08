import mongoose from 'mongoose';
import Task from '../models/Task.js';
import data from './mock.js';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = String(process.env.DATABASE_URL);

mongoose.connect(DATABASE_URL)

await Task.deleteMany({});
await Task.insertMany(data);

console.log("Data seeded successfully");

mongoose.connection.close();