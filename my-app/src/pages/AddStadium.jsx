import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const tunisianRegions = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
  "Kairouan", "Kasserine", "Kebili", "Kef", "Mahdia", "Manouba", "Medenine",
  "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine",
  "Tozeur", "Tunis", "Zaghouan"
];

const timeSlots = [
  "6:00 AM - 7:30 AM", "7:30 AM - 9:00 AM", "9:00 AM - 10:30 AM",
  "10:30 AM - 12:00 PM", "12:00 PM - 1:30 PM", "1:30 PM - 3:00 PM",
  "3:00 PM - 4:30 PM", "4:30 PM - 6:00 PM", "6:00 PM - 7:30 PM",
  "7:30 PM - 9:00 PM", "9:00 PM - 10:30 PM", "10:30 PM - 12:00 AM",
];

function AddStadium() {
  const [stadiumName, setStadiumName] = useState('');
  const [region, setRegion] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [image, setImage] = useState(null);

  const handleAddSlot = () => {
    if (selectedSlot && !slots.includes(selectedSlot)) {
      setSlots([...slots, selectedSlot]);
      setSelectedSlot('');
    }
  };

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('stadiumName', stadiumName);
    formData.append('region', region);
    formData.append('slots', JSON.stringify(slots)); // send slots as JSON string
    if (image) {
      formData.append('image', image); // append the real file
    }

    try {
      const response = await axios.post('http://localhost:8081/api/stadiums/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      console.log('Stadium created:', response.data);
      setStadiumName('');
      setRegion('');
      setSlots([]);
      setImage(null);
    } catch (error) {
      console.error('Error creating stadium:', error);
      alert('Failed to create stadium. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-800 flex items-start justify-center p-6 pt-32 gap-8 flex-wrap">
      <motion.div
        className="w-full max-w-md bg-black/70 p-8 rounded-3xl shadow-2xl border border-white/10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Add Your Stadium</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">Stadium Name</label>
            <input
              type="text"
              value={stadiumName}
              onChange={(e) => setStadiumName(e.target.value)}
              placeholder="Enter stadium name"
              className="w-full px-4 py-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">Location</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:outline-none focus:border-red-500"
            >
              <option value="" disabled>Select a region</option>
              {tunisianRegions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">Available Time Slots</label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:outline-none focus:border-red-500"
            >
              <option value="" disabled>Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAddSlot}
              className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition duration-300"
            >
              Add Slot
            </button>
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-sm font-semibold text-gray-300">Selected Time Slots</label>
            <ul className="space-y-2 max-h-32 overflow-y-auto">
              {slots.map((slot, index) => (
                <li key={index} className="flex items-center justify-between text-sm text-gray-300">
                  {slot}
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">Upload Stadium Image (Optional)</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-500 file:text-white hover:file:bg-red-600"
            />
          </div>

          <motion.button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Stadium
          </motion.button>

          <div className="text-center mt-4">
            <Link to="/" className="text-gray-300 hover:text-red-400 transition duration-300 text-sm">
              ← Back to Home
            </Link>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {(stadiumName || region || slots.length || image) && (
          <motion.div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 p-4 rounded-lg shadow-xl text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold">Preview</h3>
            <p>{stadiumName && `Stadium Name: ${stadiumName}`}</p>
            <p>{region && `Region: ${region}`}</p>
            <ul>
              {slots.map((slot, index) => (
                <li key={index}>{slot}</li>
              ))}
            </ul>
            {image && <p>Image Selected: {image.name}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AddStadium;
