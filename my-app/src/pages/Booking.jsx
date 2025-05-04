import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import axios from 'axios';

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
  const [errorMsg, setErrorMsg] = useState('');
  const [touched, setTouched] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [userId, setUserId] = useState(null);
  const confirmButtonRef = useRef();

  // Validation helpers
  const validate = () => {
    return {
      phone: !form.phone ? 'Phone is required' : '',
      date: !form.date ? 'Date is required' : '',
      timeSlot: !form.timeSlot ? 'Time slot is required' : '',
    };
  };
  const errors = validate();
  const isFormValid = !errors.phone && !errors.date && !errors.timeSlot;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = response.data;
        setForm((prevForm) => ({
          ...prevForm,
          name: user.username || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
        }));
        setUserId(user);
      } catch (err) {
        // Optionally handle error (e.g., show message)
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

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
    setTouched((prev) => ({ ...prev, date: true }));
  };

  const handleFieldBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ phone: true, date: true, timeSlot: true });
    setErrorMsg('');
    if (!isFormValid) return;
    setShowSummary(true);
    setShowLivePreview(false);
    setTimeout(() => {
      if (confirmButtonRef.current) confirmButtonRef.current.focus();
    }, 100);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setErrorMsg('');
    const tokenData = localStorage.getItem('token');
    console.log("token :",tokenData);
    
    if (!tokenData) {
      setErrorMsg('User not found. Please log in again.');
      setLoading(false);
      return;
    }
    const bookingPayload = {
      stadium: { id: stadium },
      user: { id: userId && userId.id ? userId.id : userId },
      bookingDateTime: getBookingDateTime(form.date, form.timeSlot),
    };
    console.log("****************************booking payload :",bookingPayload);
    try { 
      await axios.post(`http://localhost:8081/api/booking/book`, bookingPayload, {
        headers: {
          Authorization: tokenData ? `Bearer ${tokenData}` : undefined,
          'Content-Type': 'application/json',
        },
      });
      setIsSuccess(true);
      setShowSummary(false);
      // Payment link hardcoded here
      const paymentLink = "https://knct.me/1eBwLWnZw";
      const finalPaymentLink = `${paymentLink}?stadium=${stadium}&day=${form.date.toISOString()}&time=${form.timeSlot}`;
      window.location.href = finalPaymentLink;
    } catch (error) {
      setIsSuccess(false);
      setErrorMsg(
        error.response?.data?.message ||
        error.message ||
        'Failed to create booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper to combine date and timeSlot into ISO string
  function getBookingDateTime(date, timeSlot) {
    if (!(date instanceof Date) || !timeSlot) return '';
    // timeSlot format: "10:00 - 11:30"
    const [startTime] = timeSlot.split(' - ');
    const [hours, minutes] = startTime.split(':').map(Number);
    const bookingDate = new Date(date);
    bookingDate.setHours(hours, minutes, 0, 0);
    return bookingDate.toISOString();
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading profile...</div>;
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
        {errorMsg && (
          <div className="bg-red-700 text-white p-2 mb-4 rounded text-center text-xs">{errorMsg}</div>
        )}
        {/* Display Profile Data */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Your Profile Information</h3>
        </div>
        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Booking Form">
          <div className="w-full p-3 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500">
            <label className="block text-sm font-medium">Full Name</label>
            <p>{form.name}</p>
          </div>
          <div className="w-full p-3 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500">
            <label className="block text-sm font-medium">Email</label>
            <p>{form.email}</p>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium" htmlFor="phone">Phone<span className="text-red-400 ml-1">*</span></label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('phone')}
              className={`w-full p-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 border ${errors.phone && touched.phone ? 'border-red-500' : 'border-gray-600'}`}
              aria-invalid={!!errors.phone}
              aria-describedby="phoneError"
            />
            {errors.phone && touched.phone && (
              <p className="text-red-400 text-xs mt-1" id="phoneError">{errors.phone}</p>
            )}
          </div>
          <div className="w-full">
            <label className="text-sm font-medium">Select Date<span className="text-red-400 ml-1">*</span></label>
            <DatePicker
              selected={form.date}
              onChange={handleDateChange}
              onBlur={() => handleFieldBlur('date')}
              className={`w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 border ${errors.date && touched.date ? 'border-red-500' : 'border-gray-600'}`}
              aria-invalid={!!errors.date}
              aria-describedby="dateError"
            />
            {errors.date && touched.date && (
              <p className="text-red-400 text-xs mt-1" id="dateError">{errors.date}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-300">Select Time Slot<span className="text-red-400 ml-1">*</span></label>
            <input
              name="timeSlot"
              value={form.timeSlot}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('timeSlot')}
              className={`w-full p-3 mt-2 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 border ${errors.timeSlot && touched.timeSlot ? 'border-red-500' : 'border-gray-600'}`}
              aria-invalid={!!errors.timeSlot}
              aria-describedby="timeSlotError"
            >
              
            </input>
            {errors.timeSlot && touched.timeSlot && (
              <p className="text-red-400 text-xs mt-1" id="timeSlotError">{errors.timeSlot}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-200"
            disabled={loading}
            aria-label="Confirm Booking"
          >
            {loading ? (<span className="animate-spin mr-2">⏳</span>) : '✅ Confirm Booking'}
          </button>
        </form>
      </div>
      {/* Modal Summary */}
      {showSummary && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-red-700">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Confirm Booking Details</h2>
            <ul className="text-gray-300 space-y-2 mb-4">
              <li><span className="font-semibold">Name:</span> {form.name}</li>
              <li><span className="font-semibold">Email:</span> {form.email}</li>
              <li><span className="font-semibold">Phone:</span> {form.phone}</li>
              <li><span className="font-semibold">Date:</span> {form.date && form.date.toLocaleDateString()}</li>
              <li><span className="font-semibold">Time Slot:</span> {form.timeSlot}</li>
            </ul>
            <div className="flex gap-4 justify-center mt-6">
              <button
                ref={confirmButtonRef}
                onClick={handleFinalSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold transition"
                disabled={loading}
                aria-label="Confirm Booking"
              >
                {loading ? 'Submitting...' : 'Confirm'}
              </button>
              <button
                onClick={() => setShowSummary(false)}
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-full font-bold transition"
                aria-label="Cancel Confirmation"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Live Preview */}
      {showLivePreview && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 p-4 rounded-lg shadow-xl text-white z-40">
          <h3 className="text-lg font-bold">Preview</h3>
          <p>{form.name && `Name: ${form.name}`}</p>
          <p>{form.email && `Email: ${form.email}`}</p>
          <p>{form.phone && `Phone: ${form.phone}`}</p>
          <p>{form.date && `Date: ${form.date.toLocaleDateString()}`}</p>
          <p>{form.timeSlot && `Time Slot: ${form.timeSlot}`}</p>
        </div>
      )}
    </div>
  );
}

export default Booking;
