// __tests__/BookCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import BookCard from '../src/components/BookCard';
import type { GoogleBook } from '../src/types';

describe('BookCard', () => {
  const baseBook: GoogleBook = {
    id: '1',
    volumeInfo: {
      title: 'Base Book',
      authors: ['Anon'],
      description: 'Base description',
      publishedDate: '2000',
      imageLinks: { thumbnail: 'img.jpg' },
      categories: [],
      infoLink: '',
    },
  };

  test('muestra el título y autor', () => {
    const mockBook: GoogleBook = {
      ...baseBook,
      id: '101',
      volumeInfo: {
        ...baseBook.volumeInfo,
        title: 'El Quijote',
        authors: ['Cervantes'],
      },
    };
    render(<BookCard book={mockBook} />);
    expect(screen.getByText('El Quijote')).toBeInTheDocument();
    expect(screen.getByText('Cervantes')).toBeInTheDocument();
  });

  test('muestra "Sin descripción disponible." si no hay descripción', () => {
    const mockBook: GoogleBook = {
      ...baseBook,
      id: '102',
      volumeInfo: {
        ...baseBook.volumeInfo,
        title: 'Sin descripción',
        description: undefined,
      },
    };
    render(<BookCard book={mockBook} />);
    expect(screen.getByText('Sin descripción disponible.')).toBeInTheDocument();
  });

  test('muestra "Autor desconocido" si no hay autores', () => {
    const mockBook: GoogleBook = {
      ...baseBook,
      id: '103',
      volumeInfo: {
        ...baseBook.volumeInfo,
        title: 'Sin Autor',
        authors: undefined,
      },
    };
    render(<BookCard book={mockBook} />);
    expect(screen.getByText('Autor desconocido')).toBeInTheDocument();
  });

  test('muestra placeholder si no hay imagen', () => {
    const mockBook: GoogleBook = {
      ...baseBook,
      id: '104',
      volumeInfo: {
        ...baseBook.volumeInfo,
        title: 'Sin Imagen',
        imageLinks: undefined,
      },
    };
    render(<BookCard book={mockBook} />);
    // Verifica que no haya imagen (usa el div de fondo gris)
    const img = screen.queryByRole('img');
    expect(img).toBeNull();
  });
});
