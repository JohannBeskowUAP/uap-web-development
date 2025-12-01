const GOOGLE_BOOKS_API_BASE = 'https://www.googleapis.com/books/v1/volumes';

export interface GoogleBook {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        pageCount?: number;
        categories?: string[];
        averageRating?: number;
        ratingsCount?: number;
        imageLinks?: {
            thumbnail?: string;
            smallThumbnail?: string;
        };
        publisher?: string;
        publishedDate?: string;
        industryIdentifiers?: { type: string; identifier: string }[];
    };
}

export async function searchBooks(query: string, maxResults: number = 10, orderBy: string = 'relevance') {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `${GOOGLE_BOOKS_API_BASE}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&orderBy=${orderBy}&key=${apiKey}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Google Books API error: ${res.statusText}`);
        const data = await res.json();
        return data.items || [];
    } catch (error) {
        console.error('Error searching books:', error);
        return [];
    }
}

export async function getBookDetails(bookId: string): Promise<GoogleBook | null> {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `${GOOGLE_BOOKS_API_BASE}/${bookId}?key=${apiKey}`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`Google Books API error: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error getting book details:', error);
        return null;
    }
}
