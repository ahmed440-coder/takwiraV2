import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';
import Logo from '../Logo2.png';
import Profil from '../profil.jpg';  // Import actual profile picture
import { FaUserAlt } from 'react-icons/fa';  // Importing a user icon from react-icons

function Navbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true); // State to track navbar visibility
  const [lastScrollY, setLastScrollY] = useState(0); // State to track last scroll position
  const profileRef = useRef(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle scroll event to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Scroll down, hide navbar
        setShowNavbar(false);
      } else {
        // Scroll up, show navbar
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY); // Update the last scroll position
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 py-4 px-6 flex justify-between items-center transition-all duration-300 ${showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
    >
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={Logo}
          alt="Logo"
          className="h-17 w-auto transform hover:scale-110 transition duration-300"
        />
      </div>

      {/* Centered Nav Links for desktop */}
      <div className={`hidden lg:flex justify-center items-center gap-6 px-40 py-1.5 w-fit rounded-xl bg-white/10 backdrop-blur-md shadow-md border border-white/10`}>
        <div className="flex gap-40">
          <Link to="/" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
            Home
          </Link>
          <Link to="/StadiumPreview" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
            Stadium Preview
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
                Profile
              </Link>
              <Link to="/admin" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
                Admin
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
                Login
              </Link>
              <Link to="/signup" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Profile Dropdown */}
      <div className="relative ml-4" ref={profileRef}>
        {/* Profile Image or React Icon as Placeholder */}
        <div className="w-12 h-12 rounded-full border-4 border-red-500 cursor-pointer hover:scale-110 hover:border-red-700 transition-all duration-300 flex justify-center items-center">
          {user ? (
            <img
              src={Profil}
              alt="User Profile"
              className="w-12 h-12 rounded-full"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            />
          ) : (
            <FaUserAlt className="text-white text-xl" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} />
          )}
        </div>

        {isProfileMenuOpen && user && ( // Only show profile menu if user is logged in
          <div className="absolute right-0 mt-2 bg-black text-white p-4 rounded-lg shadow-lg w-48 z-50">
            <ul>
              <li>
                <Link to="/profile" className="block py-2 px-4 hover:bg-gray-700 rounded">My Profile</Link>
              </li>
              <li>
                <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link>
              </li>
              <li>
                <Link to="/settings" className="block py-2 px-4 hover:bg-gray-700 rounded">Settings</Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="w-full text-left block py-2 px-4 hover:bg-gray-700 rounded"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-black p-6">
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
              Home
            </Link>
            <Link to="/StadiumPreview" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
              Stadium Preview
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
                  Profile
                </Link>
                <Link to="/admin" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
                  Admin
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
                  Login
                </Link>
                <Link to="/signup" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <button className="text-white">
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
