import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BookCard from "./BookCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const BookCollection = ({ books, addToCart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerRow, setBooksPerRow] = useState(5);

  useEffect(() => {
    const updateBooksPerRow = () => {
      const width = window.innerWidth;
      if (width < 640) setBooksPerRow(1);
      else if (width < 768) setBooksPerRow(2);
      else if (width < 1024) setBooksPerRow(3);
      else if (width < 1280) setBooksPerRow(4);
      else setBooksPerRow(5);
    };

    updateBooksPerRow();
    window.addEventListener("resize", updateBooksPerRow);
    return () => window.removeEventListener("resize", updateBooksPerRow);
  }, []);

  const totalPages = Math.ceil(books.length / booksPerRow);

  return (
    <div className="space-y-6 overflow-hidden">
      <div className="relative w-full">
        <div
          className="flex gap-4 md:gap-6 transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${(currentPage - 1) * 100}%)`,
          }}
        >
          {books.map((book) => (
            <div
              key={book.id}
              className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(25%-1rem)] xl:w-[calc(20%-1rem)] flex-none"
            >
              <BookCard book={book} addToCart={addToCart} />
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            className="btn btn-circle btn-ghost btn-sm hover:bg-base-200 transition-all duration-200"
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 text-sm font-medium">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`h-8 w-8 rounded-full transition-all duration-200 ${
                  currentPage === index + 1
                    ? "bg-black text-primary-content"
                    : "btn-ghost hover:bg-base-200"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="btn btn-circle btn-ghost btn-sm hover:bg-base-200 transition-all duration-200"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

BookCollection.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default BookCollection;