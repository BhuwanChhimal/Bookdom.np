import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CategoryPage = ({ addToCart, setIsCartOpen }) => {
  const navigate = useNavigate();
  const { categorySlug } = useParams();
  
  const categoryName = categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []); //scroll effect animation

  React.useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/books', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response');
        }

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch books');
        }

        const filteredBooks = result.data.filter(book => 
          book.category.toLowerCase() === categoryName.toLowerCase()
        );
        setBooks(filteredBooks || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-8 text-gray-800 border-b pb-4">{categoryName} Books</h1>
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-xl text-gray-600">No books found in this category.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 cursor-pointer px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 hover:scale-105 transition-colors shadow-md duration-300"
            >
              Browse All Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  const openDetailsPage = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleBuyNow = (e, book) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Buy Now clicked:', book); // Debug log
    
    try {
      const transformedBook = {
        id: book._id,
        title: book.bookName,
        author: book.authorName,
        price: Number(book.price),
        imageUrl: book.imageUrl,
        category: book.category
      };
      
      console.log('Transformed book:', transformedBook); // Debug log
      addToCart(transformedBook);
      setIsCartOpen(true);
    } catch (error) {
      console.error('Error in handleBuyNow:', error);
    }
  };

  return (
    <div className="min-h-screenp-4 sm:p-8 font-quicksand">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl mt-6 sm:text-5xl font-bold mb-8 text-gray-800 border-b pb-4">{categoryName} Books</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div 
              key={book._id}
              onClick={() => openDetailsPage(book._id)}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img 
                  src={book.imageUrl || "/api/placeholder/200/300"}
                  alt={book.bookName}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-all duration-300" />
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">{book.bookName}</h2>
                <p className="text-gray-600 mb-2 italic">{book.authorName}</p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-lg font-semibold text-blue-600">Rs.{book.price}</p>
                  <button 
                    onClick={(e) => handleBuyNow(e, book)} 
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;