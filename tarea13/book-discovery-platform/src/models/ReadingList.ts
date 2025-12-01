import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReadingList extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: string; // Google Books ID
  status: 'want-to-read' | 'reading' | 'read';
  priority?: 'low' | 'medium' | 'high';
  rating?: number;
  review?: string;
  notes?: string;
  dateAdded: Date;
  dateFinished?: Date;
  bookData: {
    title: string;
    authors: string[];
    thumbnail?: string;
    categories?: string[];
  };
}

const ReadingListSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  bookId: { type: String, required: true, index: true },
  status: { 
    type: String, 
    enum: ['want-to-read', 'reading', 'read'], 
    default: 'want-to-read' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },
  notes: { type: String },
  dateAdded: { type: Date, default: Date.now },
  dateFinished: { type: Date },
  bookData: {
    title: { type: String, required: true },
    authors: [{ type: String }],
    thumbnail: { type: String },
    categories: [{ type: String }]
  }
}, { timestamps: true });

// Compound index to prevent duplicate books for same user
ReadingListSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const ReadingList: Model<IReadingList> = mongoose.models.ReadingList || mongoose.model<IReadingList>('ReadingList', ReadingListSchema);

export default ReadingList;
