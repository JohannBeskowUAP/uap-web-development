// lib/validation.ts
import { z } from "zod";

// User Schema
export const UserSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Review Schema
export const ReviewSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  bookId: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string().min(1, "Review text is required"),
  createdAt: z.string().optional(),
});

// Vote Schema
export const VoteSchema = z.object({
  _id: z.string().optional(),
  reviewId: z.string(),
  userId: z.string(),
  value: z.enum(["up", "down"]),
});

// Favorite Schema
export const FavoriteSchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  bookId: z.string(),
  title: z.string(),
  authors: z.array(z.string()).optional(),
  coverUrl: z.string().url().optional(),
});

// ✅ Export all together for convenience
export const Schemas = {
  User: UserSchema,
  Review: ReviewSchema,
  Vote: VoteSchema,
  Favorite: FavoriteSchema,
};

// ✅ Infer TypeScript types from Zod
export type User = z.infer<typeof UserSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Vote = z.infer<typeof VoteSchema>;
export type Favorite = z.infer<typeof FavoriteSchema>;
