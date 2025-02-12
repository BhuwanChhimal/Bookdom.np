import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookCollections = ({ addToCart }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/books');
        if (!response.ok) throw new Error('Failed to fetch books');
        const data = await response.json();
        // Shuffle the books array before setting it to state
        setBooks(shuffleArray(data.data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleAddToCart = (book, e) => {
    e.stopPropagation();
    addToCart({
      id: book._id,
      title: book.bookName,
      author: book.authorName,
      price: parseFloat(book.price),
      imageUrl: book.imageUrl,
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 font-quicksand">
      <h1 className="text-3xl font-bold mb-8">Book Collections</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((book) => (
          <div
            key={book._id}
            onClick={() => handleBookClick(book._id)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden group"
          >
            <div className="aspect-[2/3] overflow-hidden">
              <img
                src={book.imageUrl}
                alt={book.bookName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              />
            </div>
            
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg line-clamp-1">{book.bookName}</h3>
              <p className="text-gray-600 text-sm italic">by {book.authorName}</p>
              <div className="flex justify-between items-center pt-2">
                <p className="font-bold text-blue-600">Rs.{book.price}</p>
                <button
                  onClick={(e) => handleAddToCart(book, e)}
                  className="bg-blue-500 text-white px-3 py-2 cursor-pointer hover:scale-102 rounded-lg hover:bg-blue-600 transition-all hover:shadow-lg text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCollections;