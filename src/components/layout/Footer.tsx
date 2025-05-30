import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; {currentYear} HealthTrack. All rights reserved.</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-gray-300 hover:text-white transition duration-150">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition duration-150">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition duration-150">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;