import React from 'react'

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookDetails = ({ addToCart, setIsCartOpen }) => {
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/books/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch book details');
        }
        
        const transformedBook = {
          id: result.data._id,
          title: result.data.bookName,
          author: result.data.authorName,
          price: Number(result.data.price),
          imageUrl: result.data.imageUrl,
          secondaryImages: result.data.secondaryImages || [],
          category: result.data.category,
          description: result.data.description,
        };
        console.log(transformedBook)
        setBook(transformedBook);
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setBook(null);
    setSelectedImage(0);
    setIsLoading(true);
    fetchBookDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (book && typeof addToCart === 'function') {
      addToCart(book);
    }
  };

  const handleBuyNow = () => {
    if (book && typeof addToCart === 'function') {
      addToCart(book);
      setIsCartOpen(true); // Open the cart slider
    }
  };

if (isLoading) {
  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-gray-600 font-medium">Loading book details...</p>
      </div>
    </div>
  );
}


  if (!book) {
    return <div className="container mx-auto px-4 py-8">Book not found</div>;
  }

  const images = [
    book.imageUrl, 
    ...(book.secondaryImages?.map(img => img.imageUrl) || [])
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-[#d9d9d9] mt-4 rounded-lg font-quicksand">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/50 rounded-xl p-6 shadow-lg">
        {/* Image Section */}
        <div className="space-y- flex flex-col items-center md:items-start">
          <div className="w-[20rem] h-[30rem] rounded-xl shadow-lg overflow-hidden bg-white ">
            <div className="w-full h-full flex items-center justify-center p-4 hover:scale-105  border-[#d9d9d9] transition-transform duration-300">
              <img
                src={images[selectedImage]}
                alt={book.title}
                className="max-w-full max-h-full rounded-lg object-contain"
              />
            </div>
          </div>
          <div className="flex space-x-3 overflow-x-auto w-[25rem] p-4 ">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden border border-[#d9d9d9] 
                  ${selectedImage === index 
                    ? 'ring-2 ring-blue-500 shadow-md' 
                    : 'hover:ring-2 hover:ring-blue-300'
                  } transition-all duration-200`}
              >
                <div className="w-full h-full flex items-center justify-center p-1">
                  <img
                    src={img}
                    alt={`${book.title} view ${index + 1}`}
                    className="max-w-full max-h-full rounded-md object-contain"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-8 p-6 my-auto bg-white rounded-lg shadow-lg">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">{book.title}</h1>
            <p className="text-xl text-gray-600 italic">By {book.author}</p>
            <p className="text-3xl font-semibold text-blue-600">Rs.{book.price}</p>
          </div>
          
          <div className="h-px bg-gray-200" />
          
          <p className="text-gray-700 text-lg leading-relaxed">
            {book.description}
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 px-2 md:px-4 lg:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                transition-all duration-200 hover:shadow-md"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 px-2 md:px-4 lg:px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
                transition-all duration-200 hover:shadow-md">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;