import React, { useState } from 'react';

const Admin = () => {
  const stats = [
    { label: 'Total Revenue', value: '2,350 TND', color: 'bg-red-600' },
    { label: 'Active Players', value: '128', color: 'bg-green-600' },
    { label: 'Booked Hours', value: '52', color: 'bg-yellow-500' },
    { label: 'Empty Slots', value: '31', color: 'bg-gray-700' }
  ];

  const recentBookings = [
    { name: 'Mohamed Ali', time: 'Today 18:00', status: 'Confirmed' },
    { name: 'Firas Ben Salah', time: 'Yesterday 17:00', status: 'Pending' },
    { name: 'Ahmed Jlassi', time: 'Today 20:00', status: 'Confirmed' }
  ];

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  // Example: simulate loading and error for demonstration
  const handleAction = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Simulate async admin action
      await new Promise(res => setTimeout(res, 1000));
      setSuccessMsg('Admin action completed successfully!');
    } catch (e) {
      setErrorMsg('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 pt-40">
      <h1 className="text-3xl font-bold mb-8 text-red-500">Admin Dashboard</h1>

      {errorMsg && <div className="bg-red-700 text-white p-2 rounded text-center text-xs mb-4">{errorMsg}</div>}
      {successMsg && <div className="bg-green-600 text-white p-2 rounded text-center text-xs mb-4">{successMsg}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-6 ${stat.color} shadow-lg text-center hover:scale-105 transition focus-within:ring-2 focus-within:ring-red-400`}
            tabIndex={0}
            aria-label={stat.label}
          >
            <h2 className="text-xl font-bold">{stat.value}</h2>
            <p className="text-sm opacity-80 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-2">Player</th>
                <th className="py-2">Time</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 transition" tabIndex={0} aria-label={`Booking for ${booking.name} at ${booking.time}`}> 
                  <td className="py-3">{booking.name}</td>
                  <td className="py-3">{booking.time}</td>
                  <td className={`py-3 font-semibold ${booking.status === 'Confirmed' ? 'text-green-400' : 'text-yellow-300'}`}>
                    {booking.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={handleAction} className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition duration-300" aria-label="Simulate Admin Action" disabled={loading}>
          {loading ? 'Processing...' : 'Simulate Admin Action'}
        </button>
      </div>
    </div>
  );
};

export default Admin;
