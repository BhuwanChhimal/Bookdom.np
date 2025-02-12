import React, { useState } from 'react';
import  Book  from '../assets/open-book.png';
import { useNavigate } from 'react-router-dom';

const CategoryBrowser = ({ categories = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Finance',
  'Romance',
  'Biography',
  'History',
  'Self-Help'
] }) => {
  const navigate = useNavigate();
  const handleCategoryClick = (category) => {
    // Convert category to URL-friendly format
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    navigate(`/category/${categorySlug}`);
  };
  return (
    <div className="p-8 max-w-6xl mx-auto font-quicksand ">
      <h1 className="text-4xl font-bold text-center mb-12">Browse by Category</h1>
      
      <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <button
            onClick={() => handleCategoryClick(category)}
            key={category}
            className={`group cursor-pointer bg-[#d9d9d9] shadow-lg rounded-lg p-6 flex flex-col items-start hover:scale-107 transition-all hover:bg-gray-200 hover:shadow-xl
            `}
          >
            <img src={Book} alt="open book image"/>
            <span className="text-xl text-gray-800">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBrowser;