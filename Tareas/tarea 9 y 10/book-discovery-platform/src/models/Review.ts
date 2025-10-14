import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema({
  bookId: { type: String, required: true },
  userId: { type: String }, // opcional, si luego tenés login
  userName: { type: String, default: "Anonymous" },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = models.Review || model("Review", ReviewSchema);

export default Review;

export interface Review {
  _id?: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}
