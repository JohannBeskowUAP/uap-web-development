import { Schema, model, Document, Types } from "mongoose";

export interface IVote extends Document {
  userId: Types.ObjectId;     // referencia a User
  reviewId: Types.ObjectId;   // referencia a Review
  value: number;              // +1 o -1
}

const voteSchema = new Schema<IVote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviewId: { type: Schema.Types.ObjectId, ref: "Review", required: true },
    value: { type: Number, enum: [1, -1], required: true },
  },
  { timestamps: true }
);

export default model<IVote>("Vote", voteSchema);
