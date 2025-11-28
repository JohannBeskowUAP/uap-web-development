import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const type = searchParams.get('type') || 'all' // can be 'author', 'title', 'isbn', or 'all'

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 })
  }

  // Build search term for Google Books API
  let searchQuery = ''
  switch (type) {
    case 'author':
      searchQuery = `inauthor:${query}`
      break
    case 'title':
      searchQuery = `intitle:${query}`
      break
    case 'isbn':
      searchQuery = `isbn:${query}`
      break
    default:
      searchQuery = query
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`
    )
    const data = await res.json()

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
