import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Users, FileText } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2 transition duration-150 hover:opacity-80">
            <Activity className="h-8 w-8" strokeWidth={2.5} />
            <h1 className="text-2xl font-bold tracking-tight">HealthTrack</h1>
          </Link>
          
          <nav className="hidden md:flex">
            <ul className="flex space-x-1">
              <li>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-md flex items-center space-x-1 transition duration-150 ${
                    isActive('/') ? 'bg-white/20 font-medium' : 'hover:bg-white/10'
                  }`}
                >
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/programs"
                  className={`px-4 py-2 rounded-md flex items-center space-x-1 transition duration-150 ${
                    isActive('/programs') ? 'bg-white/20 font-medium' : 'hover:bg-white/10'
                  }`}
                >
                  <span>Programs</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/clients"
                  className={`px-4 py-2 rounded-md flex items-center space-x-1 transition duration-150 ${
                    isActive('/clients') ? 'bg-white/20 font-medium' : 'hover:bg-white/10'
                  }`}
                >
                  <span>Clients</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="md:hidden">
            {/* Mobile menu button - simplified for the demo */}
            <button className="flex items-center p-2 rounded-md hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - simplified for the demo */}
      <div className="md:hidden hidden">
        <nav className="px-4 pt-2 pb-4 space-y-1 bg-blue-800">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md ${
              isActive('/') ? 'bg-white/20 font-medium' : 'hover:bg-white/10'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/programs"
            className={`block px-3 py-2 rounded-md ${
              isActive('/programs') ? 'bg-white/20 font-medium' : 'hover:bg-white/10'
            }`}
          >
            Programs
          </Link>
          <Link
            to="/clients"
            className={`block px-3 py-2 rounded-md ${
              isActive('/clients') ? 'bg-white/20 font-medium' : 'hover:bg-white/10'
            }`}
          >
            Clients
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;