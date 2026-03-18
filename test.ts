import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODBURL;

console.log("URI:", uri);

mongoose
  .connect(uri as string)
  .then(() => {
    console.log("✅ Connected successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err);
    process.exit(1);
  });