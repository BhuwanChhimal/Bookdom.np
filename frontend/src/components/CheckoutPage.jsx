import React from "react";

const CheckoutPage = ({ cartItems }) => {
  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:5001/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to initiate checkout. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <button
        onClick={handleCheckout}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default CheckoutPage;