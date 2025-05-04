import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios'; // Import Axios

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

// 🎯 Calendar component
const Calendar = ({ stadium }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const navigate = useNavigate();

  const startOfWeek = dayjs().startOf('week').add(1, 'day').add(weekOffset, 'week');
  const currentWeekDates = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));

  const handlePreviousWeek = () => setWeekOffset((prev) => prev - 1);
  const handleNextWeek = () => setWeekOffset((prev) => prev + 1);

  const bookedSlots = stadium.bookedSlots || {};

  const handleBooking = (dateStr, time) => {
    // Redirecting to the booking page with query params
    navigate(`/booking?stadium=${stadium.stadiumName}&day=${dateStr}&time=${time}`);
  };

  return (
    <div className="space-y-10 mt-10" id="calendar">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-red-400">{stadium.stadiumName}</h2>
        <div className="space-x-2">
          <button
            onClick={handlePreviousWeek}
            className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-xl border border-gray-600 shadow-lg hover:scale-105"
          >
            ⬅
          </button>
          <button
            onClick={handleNextWeek}
            className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-xl border border-gray-600 shadow-lg hover:scale-105"
          >
            ➡
          </button>
        </div>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-8 text-center border-b border-gray-700 pb-4">
        <div></div>
        {currentWeekDates.map((date) => (
          <div key={date.format('YYYY-MM-DD')} className="text-sm font-bold text-gray-300">
            {date.format('ddd')}<br />
            <span className="text-red-500">{date.format('DD/MM')}</span>
          </div>
        ))}
      </div>

      {/* Time slots */}
      <div className="border rounded-2xl border-gray-700 p-4 bg-gradient-to-br from-black via-gray-900 to-black shadow-xl overflow-x-auto">
        {times.map((time) => (
          <div key={time} className="grid grid-cols-8 gap-1 mb-3">
            <div className="text-xs text-gray-500 py-3 text-center">{time}</div>
            {currentWeekDates.map((date) => {
              const dateStr = date.format('YYYY-MM-DD');
              const isBooked = bookedSlots[dateStr]?.includes(time);
              const isDisabled = dayjs(date).isBefore(dayjs(), 'day');

              return (
                <div
                  key={`${dateStr}-${time}`}
                  className={`rounded-xl py-3 text-center text-sm font-medium transition cursor-pointer border ${
                    isBooked
                      ? 'bg-red-800/70 text-white opacity-70 border-red-900'
                      : isDisabled
                      ? 'bg-gray-600 text-white opacity-50 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02] border-green-700 shadow-md'
                  }`}
                >
                  {isBooked ? 'Réservé' : isDisabled ? 'Passé' : (
                    <button onClick={() => handleBooking(dateStr, time)}>
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
  );
};

// 🎯 Main StadiumSelection component
const StadiumSelection = () => {
  const [stadiums, setStadiums] = useState([]); // Store fetched stadiums
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const calendarRef = useRef(null); // Use useRef for calendar section

  useEffect(() => {
    axios.get('http://localhost:8081/api/stadiums/getAll') // Replace with actual endpoint
      .then((response) => {
        console.log(response.data); // Check the structure of the data
        setStadiums(response.data);
      })
      .catch((error) => {
        console.error('Error fetching stadiums:', error);
      });
  }, []);
  

  const handleSelectStadium = (stadiumName) => {
    const selected = stadiums.find(s => s.stadiumName === stadiumName);
    setSelectedStadium(selected);
    setCurrentImage(0);
  };

  const scrollToCalendar = () => {
    if (calendarRef.current) {
      calendarRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-12 px-4 md:px-8 pt-40">
      <div className="max-w-7xl mx-auto space-y-10">
        <h1 className="text-5xl font-extrabold text-red-500 tracking-tight mb-4 text-center">📅 Takwira</h1>
        <p className="text-gray-400 font-light text-md text-center mb-8">Sélectionnez un stade pour réserver votre créneau.</p>

        <AnimatePresence mode="wait">
          {selectedStadium ? (
            <motion.div
              key="preview"
              className="space-y-8"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stadium details */}
              <div className="w-full max-w-lg bg-black/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10 mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center text-white">Détails du stade</h2>
                <div className="relative w-full h-60 rounded-lg overflow-hidden shadow-lg">
                  <img src={`data:image/jpeg;base64,${selectedStadium.image}`} alt="Stadium" className="object-cover w-full h-full" />
                </div>
                <div className="mt-6 text-white">
                  <p className="text-lg font-semibold">Localisation: {selectedStadium.region}</p>
                 
                  <ul className="mt-2">
                    <li><strong>Équipements:</strong></li>
                    {selectedStadium.features && selectedStadium.features.length > 0 ? (
                      selectedStadium.features.map((feature, idx) => (
                        <li key={idx} className="ml-4">- {feature}</li>
                      ))
                    ) : (
                      <li className="ml-4">Aucun équipement spécifique mentionné</li>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col space-y-4 mt-6">
                  <button
                    onClick={() => setSelectedStadium(null)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl transition transform hover:scale-105"
                  >
                    Choisir un autre stade
                  </button>
                  <button
                    onClick={scrollToCalendar} // Now this button will trigger scroll
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl transition transform hover:scale-105"
                  >
                    Réserver maintenant
                  </button>
                </div>
              </div>

              {/* Calendar */}
              <div ref={calendarRef}> {/* Attach ref to the calendar section */}
                <Calendar stadium={selectedStadium} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="selection"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {stadiums.map((stadium) => (
                <div
                  key={stadium.stadiumName}
                  className="border rounded-xl overflow-hidden shadow-lg cursor-pointer hover:border-red-500 hover:scale-105 transform transition duration-300"
                  onClick={() => handleSelectStadium(stadium.stadiumName)}
                >
                  <img
                    src={`data:image/jpeg;base64,${stadium.image}`}
                    alt={stadium.stadiumName}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-white">{stadium.stadiumName}</h3>
                    <p className="text-sm text-gray-300">{stadium.location}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StadiumSelection;
