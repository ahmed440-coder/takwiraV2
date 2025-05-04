import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';
import axios from 'axios';
import Logo from '../Logo2.png';
import Profil from '../profil.jpg';
import { FaUserAlt } from 'react-icons/fa';

function Navbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const profileRef = useRef(null);
  const { user, logout } = useAuth();

  // Fetch Current User on Mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // If no token, skip

        const response = await axios.get('http://localhost:8081/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCurrentUser(response.data); // Set the currentUser after fetching
        console.log('Fetched User:', response.data); // Debug log to check the response

      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);

  // Close Profile Menu on Click Outside
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

  // Show/Hide Navbar on Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  console.log('User:', user); // Debug log to check the `user` value from the AuthContext
  console.log('Current User:', currentUser); // Debug log to check the `currentUser` fetched from API

  return (
    <nav className={`w-full fixed top-0 left-0 z-50 py-4 px-6 flex justify-between items-center transition-all duration-300 ${showNavbar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={Logo}
          alt="Logo"
          className="h-17 w-auto transform hover:scale-110 transition duration-300"
        />
      </div>

      {/* Centered Nav Links for desktop */}
      <div className="hidden lg:flex justify-center items-center gap-6 px-40 py-1.5 w-fit rounded-xl bg-white/10 backdrop-blur-md shadow-md border border-white/10">
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

              {/* Debug log to see if the currentUser has the 'ADMIN' role */}
              {currentUser?.role === 'ADMIN' ? (
                <>
                  <Link to="/admin" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
                    Admin
                  </Link>
                 
                </>
              ) : (
                console.log('User is not admin or currentUser is not set properly')
              )}
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

        {isProfileMenuOpen && user && (
          <div className="absolute right-0 mt-2 bg-black text-white p-4 rounded-lg shadow-lg w-48 z-50">
            <ul>
              <li>
                <Link to="/profile" className="block py-2 px-4 hover:bg-gray-700 rounded">My Profile</Link>
              </li>
                <li>
                  <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link>
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

                {currentUser?.role === 'ADMIN' && (
                  <Link to="/admin" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
                    Admin
                  </Link>
                )}
                  <Link to="/dashboard" className="text-white font-semibold hover:text-red-500 transition-all duration-300">
                    Dashboard
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
