import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Booking from './pages/Booking';
import Addstadium from './pages/AddStadium';
import StadiumPreview from './pages/StadiumPreview';
import Navbar from './components/Navbar';

import PrivateRoute from './PrivateRoute';
import Calendar from './pages/Calendar';
import Admin from './pages/Admin';

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <div>
      <Navbar />
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Private routes wrapper */}
      <Route element={<PrivateRoute user={user} />}>
        <Route path="/dashboard" element={<Dashboard role="user" />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/StadiumPreview" element={<StadiumPreview />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/Addstadium" element={<Addstadium />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<h2 className="p-6 text-red-600 text-center">404 - Page Not Found</h2>} />
    </Routes>
    </div>
  );
};

export default AppRouter;
