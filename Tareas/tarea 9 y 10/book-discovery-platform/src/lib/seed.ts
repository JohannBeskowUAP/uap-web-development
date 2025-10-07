import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Review from "@/models/Review";
import Vote from "@/models/Vote";
import Favorite from "@/models/Favorite";
import bcrypt from "bcrypt";

async function seed() {
  await connectDB();

  console.log("🌱 Seeding database...");

  await User.deleteMany({});
  await Review.deleteMany({});
  await Vote.deleteMany({});
  await Favorite.deleteMany({});

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = await User.create({
    email: "test@example.com",
    password: hashedPassword,
    name: "Test User",
  });

  const review = await Review.create({
    userId: user._id,
    bookId: "harrypotter123",
    rating: 5,
    comment: "Increíble libro!",
  });

  await Vote.create({ userId: user._id, reviewId: review._id, value: 1 });
  await Favorite.create({ userId: user._id, bookId: "harrypotter123" });

  console.log("✅ Database seeded!");
  process.exit();
}

seed();
