import { Schema, model, Document, Types } from "mongoose";

export interface IFavorite extends Document {
  userId: Types.ObjectId;   // referencia a User
  bookId: string;           // id del libro de Google Books
}

const favoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IFavorite>("Favorite", favoriteSchema);
