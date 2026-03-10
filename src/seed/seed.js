import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Book } from "../models/Book.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = async () => {
  try {
    await connectDB();

    const dataPath = path.join(__dirname, "..", "..", "sample-data.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    const data = JSON.parse(raw);

    await User.deleteMany({});
    await Book.deleteMany({});

    const users = await Promise.all(
      data.users.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        return User.create({ ...u, password: hashedPassword });
      })
    );

    const books = await Book.insertMany(data.books);

    console.log(
      `Seeded ${users.length} users and ${books.length} books successfully.`
    );
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();

