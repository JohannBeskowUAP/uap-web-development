import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
    )
    const data = await res.json()

    // Normalize data so your frontend gets what it expects
    const books = (data.items || []).map((item: any) => ({
      googleId: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ['Autor desconocido'],
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || '/no-cover.png',
    }))

    return NextResponse.json({ books })
  } catch (err) {
    console.error('Error fetching Google Books API:', err)
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
}
