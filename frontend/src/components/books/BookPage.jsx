import React from 'react'
import { useState, useEffect } from 'react';
import { BookCollection } from './BookCollection';

const LoadingState = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
          <div className="w-full h-48 bg-gray-200 rounded-md mb-3" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ErrorState = ({ onRefresh }) => (
  <div className="container mx-auto px-4 py-8">
    <button 
      className='p-2 bg-blue-500 text-white ml-[45%] font-quicksand cursor-pointer rounded-md drop-shadow-lg focus:bg-blue-800' 
      onClick={onRefresh}
    >
      Refresh Page
    </button>
    <LoadingState />
  </div>
);

export const BookPage = ({ addToCart }) => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5001/api/books', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      setBooks(shuffleArray(result.data || []));
    } catch (err) {
      console.error('Error details:', err);
      setError(err.name === 'TypeError' && err.message.includes('Failed to fetch')
        ? 'Cannot connect to the server. Please check your connection.'
        : err.message || 'Failed to fetch books'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState onRefresh={() => window.location.reload()} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">EXPLORE COLLECTIONS</h2>
      <p className="text-gray-600 mb-8">Discover your next favorite read</p>
      <BookCollection 
        addToCart={addToCart}  
        books={books.map(book => ({
          id: book._id,
          title: book.bookName,
          author: book.authorName,
          price: book.price,
          category: book.category || 'General',
          imageUrl: book.imageUrl || null
        }))} 
      />
    </div>
  );
};