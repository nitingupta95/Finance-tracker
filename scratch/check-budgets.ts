import mongoose from 'mongoose';
import { Budget } from './lib/model/budget';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function checkBudgets() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to DB");
    const count = await Budget.countDocuments();
    console.log(`Total Budgets: ${count}`);
    const all = await Budget.find();
    console.log("Budgets in DB:", JSON.stringify(all, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkBudgets();
