import React, { useState } from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ rating, message, readerName, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate staggered animation delay based on index
  const animationDelay = `${index * 150}ms`;

  return (
    <div
      className="bg-[#d9d9d9] p-6 rounded-lg shadow-sm backface-hidden transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        animation: 'fadeInUp 0.6s ease-out forwards',
        animationDelay,
        opacity: 0,
        willChange: 'transform',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex mb-3 bg-white shadow-lg rounded-full w-fit p-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 transition-transform duration-300 ${
              i < rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            } ${
              isHovered 
                ? 'animate-bounce' 
                : ''
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
      <p className="font-extralight mb-3 transition-colors duration-300 hover:text-gray-900">"{message}"</p>
      <p className=" transition-colors duration-300 hover:text-gray-800">-{readerName}</p>
    </div>
  );
};

const ReaderTestimonials = ({ testimonials = [
  {
    rating: 5,
    message: "Amazing selection of books and super fast delivery. This is now my go-to bookstore!",
    readerName: "Happy Reader"
  },
  {
    rating: 4,
    message: "Amazing selection of books and super fast delivery. This is now my go-to bookstore!",
    readerName: "Happy Reader"
  },
  {
    rating: 3,
    message: "Amazing selection of books and super fast delivery. This is now my go-to bookstore!",
    readerName: "Happy Reader"
  },
  {
    rating: 5,
    message: "Amazing selection of books and super fast delivery. This is now my go-to bookstore!",
    readerName: "Happy Reader"
  }, {
    rating: 4,
    message: "Amazing selection of books and super fast delivery. This is now my go-to bookstore!",
    readerName: "Happy Reader"
  },
  {
    rating: 5,
    message: "Amazing selection of books and super fast delivery. This is now my go-to bookstore!",
    readerName: "Happy Reader"
  },
] }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 
        className="text-4xl font-bold text-center mb-12"
        style={{
          animation: 'slideDown 0.6s ease-out forwards',
          opacity: 0,
        }}
      >
        What Our Readers Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            index={index}
            rating={testimonial.rating}
            message={testimonial.message}
            readerName={testimonial.readerName}
          />
        ))}
      </div>

      <style >{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ReaderTestimonials;