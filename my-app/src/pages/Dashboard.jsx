import React from 'react';
import { FaUser, FaCogs, FaFootballBall } from 'react-icons/fa';

const Dashboard = ({ role = 'user' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-800 text-white py-10 px-4 pt-40">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-6">Dashboard</h1>

        {/* Simple User Dashboard */}
        {role === 'user' && (
          <div className="bg-black p-6 rounded-xl shadow-xl space-y-4">
            <h2 className="text-2xl font-semibold">Welcome, Player!</h2>
            <p className="text-gray-400">Here’s a quick view of your activity.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-bold">Your Bookings</h3>
                <p className="text-gray-300">3 Upcoming Matches</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-bold">Favorite Slot</h3>
                <p className="text-gray-300">Evenings (6pm - 8pm)</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-xl font-bold">Rating</h3>
                <p className="text-yellow-400">★ 4.5 / 5</p>
              </div>
            </div>
          </div>
        )}

        {/* Admin Dashboard */}
        {role === 'admin' && (
          <div className="bg-black p-6 rounded-xl shadow-xl space-y-4">
            <h2 className="text-2xl font-semibold">Admin Panel</h2>
            <p className="text-gray-400">Manage users, stadiums, and reports.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg text-center">
                <FaUser className="text-4xl mb-2 mx-auto" />
                <h3 className="text-lg font-bold">Total Users</h3>
                <p className="text-gray-300">132</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg text-center">
                <FaCogs className="text-4xl mb-2 mx-auto" />
                <h3 className="text-lg font-bold">System Settings</h3>
                <p className="text-gray-300">Updated Today</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg text-center">
                <FaFootballBall className="text-4xl mb-2 mx-auto" />
                <h3 className="text-lg font-bold">Bookings Today</h3>
                <p className="text-gray-300">12</p>
              </div>
            </div>
          </div>
        )}

        {/* Stadium Owner Dashboard */}
        {role === 'owner' && (
          <div className="bg-black p-6 rounded-xl shadow-xl space-y-4">
            <h2 className="text-2xl font-semibold">Stadium Overview</h2>
            <p className="text-gray-400">Manage your stadium’s bookings and revenue.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-900 p-4 rounded-lg text-center">
                <FaFootballBall className="text-4xl mb-2 mx-auto" />
                <h3 className="text-lg font-bold">Total Bookings</h3>
                <p className="text-gray-300">98</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg text-center">
                <FaUser className="text-4xl mb-2 mx-auto" />
                <h3 className="text-lg font-bold">Top Players</h3>
                <p className="text-gray-300">5 Active Regulars</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg text-center">
                <FaCogs className="text-4xl mb-2 mx-auto" />
                <h3 className="text-lg font-bold">Revenue</h3>
                <p className="text-green-400">$1,250</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;