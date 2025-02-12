import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CartSlider = ({ isOpen, onClose, cartItems = [], removeFromCart, updateCartItemQuantity }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Ensure price is a number
  const normalizedCartItems = cartItems.map(item => ({
    ...item,
    price: Number(item.price),
  }));
  // Safely calculate total with error handling and default values
  const totalAmount = Array.isArray(normalizedCartItems) 
    ? normalizedCartItems.reduce((sum, item) => {
        const price = Number(item?.price) || 0;
        const quantity = Number(item?.quantity) || 0;
        return sum + (price * quantity);
      }, 0)
    : 0;

  const handleQuantityChange = (itemId, delta) => {
    const item = normalizedCartItems.find(item => item.id === itemId);
    if (!item) return;

    const newQuantity = (item.quantity || 1) + delta;
    if (newQuantity < 1) return; // Don't allow quantity below 1

    // Update cart item quantity
    // This function needs to be passed as a prop from the parent
    updateCartItemQuantity(itemId, newQuantity);
  };

  const CartItem = ({ item }) => (
    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-[4/5] w-24 overflow-hidden rounded-lg">
        <img
          src={item?.imageUrl || '/api/placeholder/60/80'}
          alt={item?.title || 'Product'}
          className="object-cover w-full h-full hover:scale-110 transition-transform duration-200"
        />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-lg line-clamp-2">{item?.title || 'Untitled'}</h3>
          <h1 className='font-light italic text-sm'>by {item.author}</h1>
          <p className="mt-1">Rs.{Number(item?.price) || 0}</p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleQuantityChange(item.id, -1)}
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.id, 1)}
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={() => item?.id && removeFromCart(item.id)}
            className="text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // Use effect to disable window scrolling when the cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup to reset overflow style on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Don't render anything if the slider is closed
  if (!isOpen) return null;
  console.log(normalizedCartItems);
  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5001/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems: normalizedCartItems,
        }),
      });

      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        throw new Error('Network response was not ok');
      }

      const { url } = await response.json();
      // Redirect to the Stripe Checkout URL directly
      window.location.href = url;
    } catch (error) {
      console.error('Error in handleCheckout:', error);
      alert('Failed to initiate checkout. Please try again later.');
      setIsLoading(false);
    }
  };

  // The slider content
  const sliderContent = (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Floating Slider */}
      <div
        className="fixed font-quicksand border-white border-1 top-8 right-8 bottom-8 w-[min(400px,90vw)] bg-[#d9d9d9] rounded-xl shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col overflow-hidden translate-x-0"
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Shopping Cart ({Array.isArray(cartItems) ? cartItems.length : 0})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          {!Array.isArray(cartItems) || cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {normalizedCartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer with total and checkout button */}
        {Array.isArray(cartItems) && cartItems.length > 0 && (
          <div className="border-t p-4 bg-white">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">Rs.{totalAmount}</span>
            </div>
            <button 
              onClick={handleCheckout} 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );

  // Render the slider in a portal attached to the document body
  return createPortal(sliderContent, document.body);
};

CartSlider.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired, // Ensure price is a number
      quantity: PropTypes.number.isRequired,
      imageUrl: PropTypes.string,
    })
  ),
  removeFromCart: PropTypes.func.isRequired,
  updateCartItemQuantity: PropTypes.func.isRequired,
};

CartSlider.defaultProps = {
  cartItems: [],
};

export default CartSlider;