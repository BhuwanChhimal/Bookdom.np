import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export const BookCard = ({ book, addToCart }) => {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to parent
    if (typeof addToCart === 'function') {
      addToCart(book);
    } else {
      console.error("addToCart prop is not a function. Please provide a valid function to handle adding to cart.");
    }
  };

  const handleCardClick = () => {
    navigate(`/book/${book.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg font-quicksand shadow-lg overflow-hidden h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Image container with fixed aspect ratio */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={book.imageUrl || '/api/placeholder/300/400'}
          alt={book.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/400';
          }}
        />
      </div>
      
      {/* Book details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2 italic">by {book.author}</p>
        {book.category && (
          <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full">
            {book.category}
          </span>
        )}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          <p className="text-lg font-bold">Rs.{Number(book.price)}</p>
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
  addToCart: PropTypes.func,
};

BookCard.defaultProps = {
  addToCart: () => {
    console.warn("addToCart prop is not provided. Use a valid function to add items to the cart.");
  },
};

export default BookCard;