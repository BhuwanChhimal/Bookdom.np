import React from 'react'

import { Shuffle } from "lucide-react";
import  { useEffect, useState } from "react";

const RandomBook = ({ addToCart }) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchRandomBook = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/books/random");
      if (!response.ok) throw new Error("Failed to fetch random book");
      const data = await response.json();
      setBook(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomBook();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!book) return <div className="text-center mt-10">No book found</div>;

  const handleAddToCart = () => {
    addToCart({
      id: book._id,
      title: book.bookName,
      author: book.authorName,
      price: parseFloat(book.price),
      imageUrl: book.imageUrl,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-[#d9d9d9] mt-4 rounded-xl shadow-sm font-quicksand ">
      {/* Browse Random Button */}
      <button
        onClick={fetchRandomBook}
        className=" text-black flex items-center p-3 cursor-pointer rounded-lg bg-white mb-4 gap-2 shadow-lg hover:bg-white/90 hover:shadow-xl hover:scale-102 transition-all duration-200"
      >
        Random
        <Shuffle size={20} />
      </button>
      {/* Book Details */}
      <div className="grid md:grid-cols-2 items-center not-lg:gap-4 bg-white/50 py-4 px-6 rounded-lg shadow-lg">
        <div className="relative">
          <img
            src={book.imageUrl}
            alt={book.bookName}
            className=" w-[24rem] aspect-[2/3] rounded-lg shadow-lg hover:scale-102 transition-all duration-200"
          />
        </div>

        <div className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold">{book.bookName}</h1>
          <p className="text-xl text-gray-600 italic">by {book.authorName}</p>

          <div className="space-y-4">
            <p className="text-2xl text-blue-600 font-bold">Rs. {book.price}</p>
            <p className="text-gray-700">{book.description}</p>

            <div className="pt-6 space-x-4">
              <button
                onClick={handleAddToCart}
                className="bg-blue-500 cursor-pointer text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomBook;
