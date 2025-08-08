import mongoose from 'mongoose';
import Task from '../models/Task.js';
import data from './mock.js';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
mongoose.connect(dbUrl)

await Task.deleteMany({});
await Task.insertMany(data);

console.log("Data seeded successfully");

mongoose.connection.close();