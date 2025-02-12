import React from 'react'

// Higher-order component for fade animations
const FadeIn = ({ 
    children, 
    duration = 600, 
    delay = 0,
    direction = 'up' // 'up', 'down', 'left', 'right'
  }) => {
    const getTransform = () => {
      switch (direction) {
        case 'up': return 'translateY(20px)';
        case 'down': return 'translateY(-20px)';
        case 'left': return 'translateX(20px)';
        case 'right': return 'translateX(-20px)';
        default: return 'translateY(20px)';
      }
    };
  
    return (
      <div
        className="opacity-0"
        style={{
          animation: `fadeIn ${duration}ms ease-out forwards`,
          animationDelay: `${delay}ms`,
        }}
      >
        {children}
        <style >{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: ${getTransform()};
            }
            to {
              opacity: 1;
              transform: translate(0);
            }
          }
        `}</style>
      </div>
    );
  };

  export default FadeIn