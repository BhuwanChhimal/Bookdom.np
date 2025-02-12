import React from 'react';
import logo from "../assets/footer-logo.png";
import facebook from "../assets/Facebook.png"
import insta from "../assets/instagram.png"
import tiktok from "../assets/TikTok.png"
import ghost from "../assets/bookdom-logo.png";

const Footer = () => {
  return (
    <footer className="w-full font-quicksand py-8 px-6 rounded-lg relative z-1">
        <img src={ghost} alt="" className="absolute rotate-15 right-20 -top-3 hover:-top-6 transition-all duration-300 -z-1" />
      <div className="max-w-8xl bg-[#d9d9d9] shadow-lg rounded-lg p-4 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and Description Section */}
        <div className="flex flex-col justify-start items-start space-y-4 md:px-8">
          <div className="flex flex-col items-start">
            <img 
              src={logo}
              alt="Bookdom Logo" 
            />
            <h2 className="font-bold text-xl">BOOKDOM.NP</h2>
          </div>
          <p className="text-sm text-gray-600">
            Your premier destination for endless stories and endless joy.
          </p>
        </div>

        {/* Customer Service Section */}
        <div className="flex flex-col justify-start lg:ml-20 mt-7 items-center space-y-4">
          <h3 className="font-semibold text-lg self-start">Customer Service</h3>
          <nav className="flex flex-col space-y-2 w-full">
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Shipping Information
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              FAQ's
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Contact Us
            </a>
          </nav>
        </div>

        {/* Follow Us Section */}
        <div className="flex flex-col justify-start lg:ml-20 mt-4 items-end space-y-4 md:px-8">
          <h3 className="font-semibold text-lg self-start">Follow Us</h3>
          <div className="flex flex-col space-y-2 w-full">
            <a 
            target='_blank'
              href="https://www.instagram.com/bookdom.np/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <img 
                src={insta}
                alt="Instagram" 
              />
              <span>instagram</span>
            </a>
            <a 
            target='_blank'
              href="https://www.tiktok.com/@bookdom.np" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <img 
                src={tiktok} 
                alt="TikTok" 
              />
              <span>tiktok</span>
            </a>
            <a 
            target='_blank'
              href="https://www.facebook.com/profile.php?id=61563810441119" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <img 
                src={facebook}
                alt="Facebook" 
              />
              <span>facebook</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-center text-sm text-gray-600">
      &copy; {new Date().getFullYear()} BOOKDOM.NP All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;