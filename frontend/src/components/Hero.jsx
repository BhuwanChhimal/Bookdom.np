import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import bannerImage from "../assets/Banner-image.png";
import ghost from "../assets/bookdom-logo.png";
import { LibraryBig, Shuffle } from "lucide-react";

const TypeWriter = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <span>
      {displayText}
      {!isTypingComplete && <span className="animate-pulse">|</span>}
    </span>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  const handleExploreCollections = () => {
   navigate('/book-collections');
  };

  return (
    <div className="w-full px-4 mt-8 font-quicksand relative">
      {/* Floating Ghosts with corrected z-index */}
      <img 
        src={ghost} 
        alt="ghost-image" 
        className="absolute w-16 md:w-20 rotate-15 right-[5%] -top-8 hover:-top-10 transition-all duration-300 opacity-60 hover:opacity-80 -z-10" 
      />
      <img 
        src={ghost} 
        alt="ghost-image" 
        className="absolute w-16 md:w-20 -rotate-45 left-8 bottom-10 hover:left-8 transition-all duration-300 opacity-60 hover:opacity-80 -z-10" 
      />

      <div className="max-w-[110rem] mx-auto bg-[#d9d9d9] rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
          {/* Left Content */}
          <div className="flex-1 space-y-6 max-w-xl">
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl leading-tight">
              <TypeWriter text="Where Stories Find" speed={75}/>
              <span className="text-blue-600">
                <TypeWriter text=" Their Readers" speed={75} />
              </span>
            </h1>
            
            <p className="text-gray-700/70 text-lg md:text-xl leading-relaxed">
              From timeless classics to contemporary bestsellers, discover your next literary adventure in our carefully curated collections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={handleExploreCollections}
                className="group flex items-center cursor-pointer justify-center gap-2 bg-[#7e7e7e] px-6 py-3 rounded-xl text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Explore Collections</span>
                <LibraryBig size={20} className="group-hover:rotate-180 transition-transform duration-500"/>
              </button>
              
              <button 
                onClick={() => navigate('/random')}
                className="group flex items-center cursor-pointer justify-center gap-2 bg-[#C0C0C0] px-6 py-3 rounded-xl text-black shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Browse Random</span>
                <Shuffle size={20} className="group-hover:rotate-360 transition-transform duration-500"/>
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 md:flex justify-end items-center hidden">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0  from-[#d9d9d9] to-transparent z-10"></div>
              <img 
                src={bannerImage} 
                alt="Books Banner" 
                className="w-full h-auto object-contain relative z-0 hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
