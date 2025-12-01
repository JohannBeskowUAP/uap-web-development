import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../src/app/api/reviews/route';
import { PUT, DELETE } from '../../src/app/api/reviews/[id]/route';
import Review from '../../src/models/Review';
import { NextResponse } from 'next/server';

// Mock dependencies
vi.mock('../../src/lib/dbConnect', () => ({
    default: vi.fn(),
}));

vi.mock('../../src/models/Review', () => ({
    default: {
        find: vi.fn(),
        create: vi.fn(),
        findById: vi.fn(),
        findByIdAndUpdate: vi.fn(),
        findByIdAndDelete: vi.fn(),
    },
}));

vi.mock('next/headers', () => ({
    cookies: vi.fn(),
}));

vi.mock('../../src/lib/session', () => ({
    decrypt: vi.fn(),
}));

import { cookies } from 'next/headers';
import { decrypt } from '../../src/lib/session';

describe('Reviews API Integration Tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/reviews', () => {
        it('should return a list of reviews', async () => {
            const mockReviews = [{ _id: '1', comment: 'Great book' }];
            (Review.find as any).mockReturnValue({
                limit: vi.fn().mockReturnValue({
                    lean: vi.fn().mockResolvedValue(mockReviews),
                }),
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockReviews);
        });
    });

    describe('POST /api/reviews', () => {
        it('should reject unauthenticated requests', async () => {
            (cookies as any).mockResolvedValue({
                get: vi.fn().mockReturnValue(undefined),
            });
            (decrypt as any).mockResolvedValue(null);

            const req = new Request('http://localhost/api/reviews', {
                method: 'POST',
                body: JSON.stringify({}),
            });

            const response = await POST(req);
            expect(response.status).toBe(401);
        });

        it('should create a review for authenticated user', async () => {
            (cookies as any).mockResolvedValue({
                get: vi.fn().mockReturnValue({ value: 'valid-token' }),
            });
            (decrypt as any).mockResolvedValue({ userId: 'user123' });

            const mockReview = { bookId: '1', rating: 5, comment: 'Nice' };
            (Review.create as any).mockResolvedValue({ ...mockReview, userId: 'user123', _id: 'review1' });

            const req = new Request('http://localhost/api/reviews', {
                method: 'POST',
                body: JSON.stringify(mockReview),
            });

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.userId).toBe('user123');
        });
    });

    describe('DELETE /api/reviews/[id]', () => {
        it('should prevent deleting someone else\'s review', async () => {
            (cookies as any).mockResolvedValue({
                get: vi.fn().mockReturnValue({ value: 'valid-token' }),
            });
            (decrypt as any).mockResolvedValue({ userId: 'user123' });

            (Review.findById as any).mockResolvedValue({ userId: 'otherUser', _id: 'review1' });

            const req = new Request('http://localhost/api/reviews/review1', { method: 'DELETE' });
            const params = Promise.resolve({ id: 'review1' });

            const response = await DELETE(req, { params });
            expect(response.status).toBe(403);
        });

        it('should allow deleting own review', async () => {
            (cookies as any).mockResolvedValue({
                get: vi.fn().mockReturnValue({ value: 'valid-token' }),
            });
            (decrypt as any).mockResolvedValue({ userId: 'user123' });

            (Review.findById as any).mockResolvedValue({ userId: 'user123', _id: 'review1' });
            (Review.findByIdAndDelete as any).mockResolvedValue(true);

            const req = new Request('http://localhost/api/reviews/review1', { method: 'DELETE' });
            const params = Promise.resolve({ id: 'review1' });

            const response = await DELETE(req, { params });
            expect(response.status).toBe(200);
        });
    });
});
