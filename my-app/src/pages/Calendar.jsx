import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

// Stadiums and booked slots data
const stadiums = ['Stadium A', 'Stadium B', 'Stadium C'];

const allBookedSlots = {
  'Stadium A': {
    '2025-04-14': ['14:30', '17:30'],
    '2025-04-15': ['13:00'],
  },
  'Stadium B': {
    '2025-04-18': ['11:30'],
  },
  'Stadium C': {
    '2025-04-20': ['22:00'],
  },
};

// 🔁 Generate 1h30min intervals from 10:00 to 00:00
const generateTimeSlots = () => {
  const result = [];
  let current = dayjs().startOf('day').hour(10).minute(0);
  const endTime = dayjs().startOf('day').add(1, 'day'); // 00:00 next day

  while (current.isBefore(endTime)) {
    result.push(current.format('HH:mm'));
    current = current.add(90, 'minute');
  }

  return result;
};

const times = generateTimeSlots();

const Calendar = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [stadium, setStadium] = useState(stadiums[0]);
  const [selectedTime, setSelectedTime] = useState(null); // Added state for selected time
  const navigate = useNavigate();

  // Get the stadium from URL query parameters if available
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const selectedStadium = queryParams.get('stadium');
    if (selectedStadium && stadiums.includes(selectedStadium)) {
      setStadium(selectedStadium);
    }
  }, [location]);

  // Get the current week and the list of days
  const startOfWeek = dayjs().startOf('week').add(1, 'day').add(weekOffset, 'week');
  const currentWeekDates = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.add(i, 'day')
  );

  const handleBooking = (dateStr, time) => {
    // Navigate to the booking page with the stadium, date, and time as query parameters
    navigate(`/booking?stadium=${stadium}&day=${dateStr}&time=${time}`);
  };

  const handlePreviousWeek = () => setWeekOffset((prev) => prev - 1);
  const handleNextWeek = () => setWeekOffset((prev) => prev + 1);

  // Get the booked slots for the selected stadium
  const bookedSlots = allBookedSlots[stadium] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 px-4 md:px-8 pt-40">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black text-red-500 tracking-tight mb-1">📅 Takwira</h1>
            <p className="text-gray-400 font-light text-md">Réservez votre créneau dans votre stade préféré</p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={stadium}
              onChange={(e) => setStadium(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-600 shadow-md hover:border-red-500 focus:outline-none"
            >
              {stadiums.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <div className="space-x-2">
              <button
                onClick={handlePreviousWeek}
                className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-xl transition transform hover:scale-105 border border-gray-600"
              >
                ⬅
              </button>
              <button
                onClick={handleNextWeek}
                className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-xl transition transform hover:scale-105 border border-gray-600"
              >
                ➡
              </button>
            </div>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-8 text-center border-b border-gray-700 pb-2">
          <div></div>
          {currentWeekDates.map((date) => (
            <div key={date.format('YYYY-MM-DD')} className="text-sm font-bold text-gray-300">
              {date.format('ddd')}<br />
              <span className="text-red-400">{date.format('DD/MM')}</span>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="border rounded-2xl border-gray-700 p-2 shadow-inner bg-gray-900/30 overflow-x-auto">
          {times.map((time) => (
            <div key={time} className="grid grid-cols-8 gap-1 mb-1">
              <div className="text-xs text-gray-500 py-2 text-center">{time}</div>
              {currentWeekDates.map((date) => {
                const dateStr = date.format('YYYY-MM-DD');
                const isBooked = bookedSlots[dateStr]?.includes(time);
                const isDisabled = dayjs(date).isBefore(dayjs(), 'day'); // Disable past dates

                return (
                  <div
                    key={`${dateStr}-${time}`}
                    className={`rounded-xl py-2 text-center text-sm font-medium transition duration-200 cursor-pointer border ${
                      isBooked
                        ? 'bg-red-800/70 text-white opacity-70 border-red-900'
                        : isDisabled
                        ? 'bg-gray-600 text-white opacity-50 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-md hover:scale-[1.02] border-green-700'
                    }`}
                  >
                    {isBooked ? 'Réservé' : isDisabled ? 'Date passée' : (
                      <button
                        onClick={() => handleBooking(dateStr, time)}
                        className="font-semibold"
                        disabled={isDisabled}
                      >
                        Réserver
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
