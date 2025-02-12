import React from 'react'
import  { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { BookPage } from "./components/books";
import CategoryBrowser from "./components/Category";
import ReaderTestimonials from "./components/ReaderTestimonials";
import FadeIn from "./components/FadeIn";
import BookDetails from "./components/BookDetails";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast"
import  CheckoutPage  from './components/CheckoutPage';
import CategoryPage from "./components/CategoryPage";
import SearchResults from "./components/SearchResults";
import SuccessPage from './components/SuccessPage';
import CartSlider from "./components/CartSlider";
import RandomBook from './components/RandomBook';
import BookCollections from "./components/BookCollections";


// HomePage component defined outside of App
const HomePage = ({ addToCart }) => (
  <div className="w-full">
    <FadeIn duration={800} delay={300}>
      <Hero />
    </FadeIn>
    <FadeIn duration={800} delay={400}>
      <BookPage addToCart={addToCart} />
    </FadeIn>
    <FadeIn duration={800} delay={500}>
      <CategoryBrowser />
    </FadeIn>
    <FadeIn duration={800} delay={600}>
      <ReaderTestimonials />
    </FadeIn>
  </div>
);

const App = () => {

  const [cartItems, setCartItems] = useState(() => {
    // Try to get cart items from sessionStorage on initial load
    const savedCart = sessionStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Add effect to save cart items to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === book.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...book, quantity: 1 }];
    });
    toast.success(`${book.title} added to cart.`)
    
  };

  const removeFromCart = (bookId) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === bookId);
      
      if (existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item.id === bookId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      }
      return prevCart.filter((item) => item.id !== bookId);
    });
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems => 
      prevItems.map(item =>
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  return (
    <div >
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar 
          cartItems={cartItems} 
          removeFromCart={removeFromCart}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} />} />
            <Route path="/book/:id" element={<BookDetails addToCart={addToCart} setIsCartOpen={setIsCartOpen} />} />
            <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route 
              path="/category/:categorySlug" 
              element={
                <CategoryPage 
                  addToCart={addToCart} 
                  setIsCartOpen={setIsCartOpen}
                />
              } 
            />
            <Route 
              path="/search" 
              element={
                <SearchResults 
                  addToCart={addToCart}
                  setIsCartOpen={setIsCartOpen}
                />
              } 
            />
            <Route 
              path="/random" 
              element={
                <RandomBook 
                  addToCart={addToCart} 
                  setIsCartOpen={setIsCartOpen}
                />
              } 
            />
            <Route
              path="/book-collections"
              element={
                <BookCollections 
                  addToCart={addToCart} 
                  setIsCartOpen={setIsCartOpen}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster/>
      <CartSlider
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateCartItemQuantity={updateCartItemQuantity}
      />
    </Router>
    </div>
  );
};

export default App;