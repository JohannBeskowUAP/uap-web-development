import { z } from 'zod';
import { tool } from 'ai';
import { searchBooks as googleSearchBooks, getBookDetails as googleGetBookDetails } from './google-books';
import ReadingList from '@/models/ReadingList';
import User from '@/models/User';
import dbConnect from './dbConnect';

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';

// Helper to get the current authenticated user
async function getUser() {
  await dbConnect();
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const payload = await decrypt(session);

  if (!payload?.userId) {
    throw new Error('User not authenticated');
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

export const tools = {
  searchBooks: tool({
    description: 'Search for books by title, author, subject, or keywords.',
    parameters: z.object({
      query: z.string().describe('The search query'),
      maxResults: z.number().optional().default(10).describe('Number of results to return'),
      orderBy: z.enum(['relevance', 'newest']).optional().default('relevance').describe('Sort order')
    }),
    execute: async ({ query, maxResults, orderBy }) => {
      return await googleSearchBooks(query, maxResults, orderBy);
    },
  }),

  getBookDetails: tool({
    description: 'Get detailed information about a specific book using its Google Books ID.',
    parameters: z.object({
      bookId: z.string().describe('The Google Books ID of the book')
    }),
    execute: async ({ bookId }) => {
      return await googleGetBookDetails(bookId);
    },
  }),

  addToReadingList: tool({
    description: 'Add a book to the user\'s reading list.',
    parameters: z.object({
      bookId: z.string().describe('The Google Books ID'),
      priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
      notes: z.string().optional()
    }),
    execute: async ({ bookId, priority, notes }) => {
      await dbConnect();
      const user = await getUser();

      // Fetch book details to cache
      const bookData = await googleGetBookDetails(bookId);
      if (!bookData) throw new Error('Book not found');

      try {
        const entry = await ReadingList.create({
          userId: user._id,
          bookId,
          priority,
          notes,
          bookData: {
            title: bookData.volumeInfo.title,
            authors: bookData.volumeInfo.authors || [],
            thumbnail: bookData.volumeInfo.imageLinks?.thumbnail,
            categories: bookData.volumeInfo.categories || []
          }
        });
        return { success: true, message: `Added "${bookData.volumeInfo.title}" to reading list.`, entry };
      } catch (error: any) {
        if (error.code === 11000) {
          return { success: false, message: 'Book is already in your reading list.' };
        }
        throw error;
      }
    },
  }),

  getReadingList: tool({
    description: 'Get the user\'s reading list.',
    parameters: z.object({
      status: z.enum(['want-to-read', 'reading', 'read']).optional(),
      limit: z.number().optional().default(20)
    }),
    execute: async ({ status, limit }) => {
      await dbConnect();
      const user = await getUser();
      const query: any = { userId: user._id };
      if (status) query.status = status;

      const list = await ReadingList.find(query).limit(limit).sort({ dateAdded: -1 });
      return list;
    },
  }),

  markAsRead: tool({
    description: 'Mark a book as read and optionally rate/review it.',
    parameters: z.object({
      bookId: z.string().describe('The Google Books ID'),
      rating: z.number().min(1).max(5).optional(),
      review: z.string().optional()
    }),
    execute: async ({ bookId, rating, review }) => {
      await dbConnect();
      const user = await getUser();

      const entry = await ReadingList.findOneAndUpdate(
        { userId: user._id, bookId },
        {
          status: 'read',
          dateFinished: new Date(),
          rating,
          review
        },
        { new: true }
      );

      if (!entry) {
        // If not in list, add it as read
        const bookData = await googleGetBookDetails(bookId);
        if (!bookData) throw new Error('Book not found');

        const newEntry = await ReadingList.create({
          userId: user._id,
          bookId,
          status: 'read',
          dateFinished: new Date(),
          rating,
          review,
          bookData: {
            title: bookData.volumeInfo.title,
            authors: bookData.volumeInfo.authors || [],
            thumbnail: bookData.volumeInfo.imageLinks?.thumbnail,
            categories: bookData.volumeInfo.categories || []
          }
        });
        return { success: true, message: `Marked "${bookData.volumeInfo.title}" as read.`, entry: newEntry };
      }

      return { success: true, message: `Marked "${entry.bookData.title}" as read.`, entry };
    },
  }),

  getReadingStats: tool({
    description: 'Get statistics about the user\'s reading habits.',
    parameters: z.object({
      period: z.enum(['all-time', 'year', 'month']).optional().default('all-time')
    }),
    execute: async ({ period }) => {
      await dbConnect();
      const user = await getUser();

      const match: any = { userId: user._id, status: 'read' };
      // Add date filtering logic if needed for period

      const stats = await ReadingList.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalBooks: { $sum: 1 },
            avgRating: { $avg: '$rating' },
            genres: { $push: '$bookData.categories' }
          }
        }
      ]);

      if (stats.length === 0) return { totalBooks: 0, message: 'No books read yet.' };

      // Process genres
      const allGenres = stats[0].genres.flat();
      const genreCounts = allGenres.reduce((acc: any, genre: string) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {});
      const topGenres = Object.entries(genreCounts)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 3)
        .map(([genre]) => genre);

      return {
        totalBooks: stats[0].totalBooks,
        avgRating: stats[0].avgRating?.toFixed(1),
        topGenres
      };
    },
  }),
};
