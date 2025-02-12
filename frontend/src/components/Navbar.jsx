import React from 'react'
import  { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import logo from "../assets/bookdom-logo.png";
import bannerlogo from "../assets/Banner-image.png";

import cart from "../assets/cart.png";
import search from "../assets/search-icon.png";
import CartSlider from "./CartSlider";


const Navbar = ({ cartItems, removeFromCart, isCartOpen, setIsCartOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Add effect to manage body scroll
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted with query:", searchTerm); // Debug log
  
    if (searchTerm.trim()) {
      const searchURL = `/search?query=${encodeURIComponent(searchTerm.trim())}`;
      console.log("Navigating to:", searchURL); // Debug log
      navigate(searchURL);
      setSearchTerm("");
      setIsSearchOpen(false);
    } else {
      console.warn("Empty search query, not navigating");
    }
  };
  

  return (
    <div className="w-full px-4">
      <nav className="max-w-8xl mx-auto mt-4 bg-[#d9d9d9] rounded-lg shadow-sm relative z-10">
        <div className="flex items-center justify-between px-8 py-2">
          <section onClick={() => navigate("/")} className="cursor-pointer">
            <img src={logo} alt="logo" className="absolute left-0 -top-4" />
            <div className="ml-[2.5rem] font-quicksand font-bold">
              BOOKDOM.<span className="text-blue-600">NP</span> 
            </div>
          </section>

          <div className="right-side flex gap-2 items-center">
            {/* Mobile Search Overlay */}
            {isSearchOpen && (
              <div className="fixed inset-0 bg-white z-50 md:hidden">
                <div className="flex items-center p-4 gap-4">
                  <form 
                    className="flex-1 flex items-center"
                    onSubmit={handleSearchSubmit}
                  >
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full  border-gray-300 border-2 p-2 focus:outline-none rounded-xl"
                      placeholder="Search books..."
                      autoFocus
                    />
                  </form>
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2"
                  >
                    ✕
                  </button>
                </div>
                  <div className="mt-16">
                    <img src={bannerlogo} alt="logo" className=""/>
                  </div>
              </div>
            )}

            {/* Desktop Search */}
            <form
              className="hidden md:flex bg-white rounded-xl items-center relative"
              onSubmit={handleSearchSubmit}
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-none p-2 py-1 w-48 focus:w-72 transition-all duration-300 rounded-xl focus:outline-none"
                placeholder="Search books..."
              />
              <button type="submit" className="absolute right-1">
                <img src={search} alt="search-icon" className="w-5" />
              </button>
            </form>

            {/* Mobile Search Icon */}
            <button 
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <img src={search} alt="search-icon" className="w-5" />
            </button>

            <div
              className="flex gap-2 cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              <img src={cart} alt="cart-icon" className="w-5" />
              <div className="bg-white rounded-full w-5 text-center">
                {cartItems?.length}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <CartSlider
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
      />
    </div>
  );
};

export default Navbar;