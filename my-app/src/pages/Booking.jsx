import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

const generateTimeSlots = (selectedDate) => {
  const result = [];
  const currentDate = dayjs(selectedDate || new Date());
  let current = currentDate.startOf('day').hour(10).minute(0); // Start from 10:00 AM
  const endTime = currentDate.add(1, 'day').startOf('day'); // End after 1 day

  while (current.isBefore(endTime)) {
    const start = current.format('HH:mm');
    const end = current.add(90, 'minute').format('HH:mm');
    result.push(`${start} - ${end}`);
    current = current.add(90, 'minute');
  }

  return result;
};

const Booking = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const prefilledDate = queryParams.get('day');
  const prefilledTime = queryParams.get('time');
  const stadium = queryParams.get('stadium');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: prefilledDate ? new Date(prefilledDate) : '',
    timeSlot: prefilledTime || '',
    notes: '',
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch the profile data from localStorage
  useEffect(() => {
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const user = JSON.parse(userProfile); // Parse the stored data
      setForm((prevForm) => ({
        ...prevForm,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
    setLoading(false); // Set loading to false after fetching
  }, []);

  // Fetch time slots based on selected date
  useEffect(() => {
    if (form.date) {
      const availableTimeSlots = generateTimeSlots(form.date);
      setTimeSlots(availableTimeSlots);
    }
  }, [form.date]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setForm({ ...form, date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.phone || !form.date || !form.timeSlot) {
      alert('Please fill out all required fields!');
      return;
    }

    setIsSuccess(true);

    // Payment link hardcoded here
    const paymentLink = "https://knct.me/1eBwLWnZw"; // Replace with your actual payment URL

    // Append parameters to the payment link (optional)
    const finalPaymentLink = `${paymentLink}?stadium=${stadium}&day=${form.date.toISOString()}&time=${form.timeSlot}`;

    // Redirect to the payment page
    window.location.href = finalPaymentLink;
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-800 text-white flex items-center justify-center px-4 pt-40">
      <div className="w-full max-w-lg bg-black/80 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-4xl font-extrabold text-center mb-6 text-red-500">🎟️ Book Your Slot</h2>
        {isSuccess && (
          <div className="bg-green-600 text-white p-4 mb-4 rounded-xl shadow-md text-center">
            ✅ Booking Successful!
          </div>
        )}

        {/* Display Profile Data */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Your Profile Information</h3>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full p-3 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500">
            <label className="block text-sm font-medium">Full Name</label>
            <p>{form.name}</p>
          </div>
          <div className="w-full p-3 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500">
            <label className="block text-sm font-medium">Email</label>
            <p>{form.email}</p>
          </div>
          <div className="w-full p-3 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500">
            <label className="block text-sm font-medium">Phone</label>
            <p>{form.phone}</p>
          </div>
          <div className="w-full">
            <label className="text-sm font-medium">Select Date</label>
            <DatePicker
              selected={form.date}
              onChange={handleDateChange}
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-300">Selected Time Slot</label>
            <input
              type="text"
              name="timeSlot"
              value={form.timeSlot}
              onChange={handleChange}
              disabled
              className="w-full p-3 mt-2 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded-xl bg-red-600 text-white font-semibold"
          >
            ✅ Confirm Booking
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Booking;
