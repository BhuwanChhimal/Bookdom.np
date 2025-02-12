import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SearchResults = ({ addToCart }) => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      const query = searchParams.get('query');
      
      if (!query) {
        setError('No search query provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/books/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const responseData = await response.json();
        // Extract the data array from the response and transform the book properties
        const transformedData = responseData.data.map(book => ({
          id: book._id,
          title: book.bookName,
          author: book.authorName,
          price: parseFloat(book.price),
          imageUrl: book.imageUrl
        }));
        setResults(transformedData);
        console.log('Transformed data:', transformedData);
      } catch (err) {
        console.error('Search error:', err);
        setError('An error occurred while searching. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleAddToCart = (book, e) => {
    e.stopPropagation();
    addToCart(book);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Search Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.isArray(results) && results.length > 0 ? (
          results.map((book) => (
            <div 
              key={book.id} 
              onClick={() => handleBookClick(book.id)}
              className="aspect-[2/3] rounded-lg p-4 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              <img 
                src={book.imageUrl} 
                alt={book.title}
                className="rounded-md aspect-[2/3] mb-4 shadow-md"
              />
              <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-2 italic">{book.author}</p>
              <div className="flex justify-between items-center">
                <p className="font-bold">Rs.{book.price}</p>
                <button
                  onClick={(e) => handleAddToCart(book, e)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            No books found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;