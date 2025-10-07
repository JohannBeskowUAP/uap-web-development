import { Schema, model, Document, Types } from "mongoose";

export interface IReview extends Document {
  userId: Types.ObjectId;   // referencia a User
  bookId: string;           // id del libro de Google Books
  rating: number;           // 1-5 estrellas
  content: string;          // texto de la reseña
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<IReview>("Review", reviewSchema);
