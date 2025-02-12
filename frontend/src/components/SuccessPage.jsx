import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SuccessPage = () => {
  useEffect(() => {
    // Confetti effect
    const confetti = () => {
      const colors = ['#2196f3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0'];
      const confettiCount = 200;
      const confettiContainer = document.createElement('div');
      
      // Update container styles
      confettiContainer.style.position = 'fixed';
      confettiContainer.style.inset = '0';  // shorthand for top/right/bottom/left
      confettiContainer.style.width = '100%';
      confettiContainer.style.height = '100%';
      confettiContainer.style.pointerEvents = 'none';
      confettiContainer.style.zIndex = '1';  // Set lower z-index
      document.body.appendChild(confettiContainer);

      Array.from({ length: confettiCount }).forEach(() => {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Update individual confetti styles
        confetti.style.position = 'absolute';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = color;
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';  // Start slightly above viewport
        confetti.style.borderRadius = '50%';  // Make confetti circular
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
        confettiContainer.appendChild(confetti);
      });

      setTimeout(() => confettiContainer.remove(), 5000);
    };

    confetti();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  p-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center">
            <svg
              className="h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800 font-quicksand">
            Thank You for Your Purchase!
          </h2>
          <div className="h-1 w-20 bg-green-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your order has been successfully processed. We've sent a confirmation
            email with your order details. Your books will be available for download
            shortly.
          </p>

          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Homepage
            </Link>
            
            <button
              onClick={() => window.location.href = 'mailto:support@bookdom.com'}
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
            >
              Need help? Contact support
            </button>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes fall {
          from {
            transform: translateY(-100vh) rotate(0deg);
          }
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessPage;
