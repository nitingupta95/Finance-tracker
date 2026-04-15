import mongoose from 'mongoose';
import { Transaction } from './lib/model/transaction';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function checkDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to DB");
    const count = await Transaction.countDocuments();
    console.log(`Total Transactions: ${count}`);
    const latest = await Transaction.findOne().sort({ date: -1 });
    console.log(`Latest Transaction Date: ${latest?.date}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDB();
