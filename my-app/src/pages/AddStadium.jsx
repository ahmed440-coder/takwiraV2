import React, { useState, useRef } from 'react';
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
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [touched, setTouched] = useState({});
  const fileInputRef = useRef();

  // Validation helpers
  const validate = () => {
    return {
      stadiumName: !stadiumName ? 'Stadium name is required' : '',
      region: !region ? 'Region is required' : '',
      slots: slots.length === 0 ? 'Add at least one slot' : '',
    };
  };
  const errors = validate();
  const isFormValid = !errors.stadiumName && !errors.region && !errors.slots;

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
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleFieldBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ stadiumName: true, region: true, slots: true });
    setSuccessMsg('');
    setErrorMsg('');
    if (!isFormValid) return;
    setShowSummary(true);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('stadiumName', stadiumName);
    formData.append('region', region);
    formData.append('slots', slots.join(','));
    if (image) {
      formData.append('image', image);
    }
    try {
      const response = await axios.post('http://localhost:8081/api/stadiums/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      setSuccessMsg('Stadium created successfully!');
      setStadiumName('');
      setRegion('');
      setSlots([]);
      setImage(null);
      setImagePreview(null);
      setShowSummary(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
        error.message ||
        'Failed to create stadium. Please try again.'
      );
    } finally {
      setLoading(false);
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
        <form className="space-y-6" onSubmit={handleSubmit} aria-label="Add Stadium Form">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300" htmlFor="stadiumName">Stadium Name<span className="text-red-400 ml-1">*</span></label>
            <input
              id="stadiumName"
              type="text"
              value={stadiumName}
              onChange={(e) => setStadiumName(e.target.value)}
              onBlur={() => handleFieldBlur('stadiumName')}
              placeholder="Enter stadium name"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800/70 text-white border ${errors.stadiumName && touched.stadiumName ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-red-500`}
              aria-invalid={!!errors.stadiumName}
              aria-describedby="stadiumNameError"
            />
            {errors.stadiumName && touched.stadiumName && (
              <p className="text-red-400 text-xs mt-1" id="stadiumNameError">{errors.stadiumName}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300" htmlFor="region">Location<span className="text-red-400 ml-1">*</span></label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              onBlur={() => handleFieldBlur('region')}
              className={`w-full px-4 py-3 rounded-lg bg-gray-800/70 text-white border ${errors.region && touched.region ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:border-red-500`}
              aria-invalid={!!errors.region}
              aria-describedby="regionError"
            >
              <option value="" disabled>Select a region</option>
              {tunisianRegions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.region && touched.region && (
              <p className="text-red-400 text-xs mt-1" id="regionError">{errors.region}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300" htmlFor="slot">Available Time Slots<span className="text-red-400 ml-1">*</span></label>
            <select
              id="slot"
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/70 text-white border border-gray-600 focus:outline-none focus:border-red-500"
              aria-label="Select a time slot"
            >
              <option value="" disabled>Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot} disabled={slots.includes(slot)}>{slot}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddSlot}
              className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition duration-300"
              aria-label="Add Slot"
              disabled={!selectedSlot || slots.includes(selectedSlot)}
            >
              Add Slot
            </button>
            {errors.slots && touched.slots && (
              <p className="text-red-400 text-xs mt-1">{errors.slots}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-sm font-semibold text-gray-300">Selected Time Slots</label>
            <ul className="space-y-2 max-h-32 overflow-y-auto">
              {slots.map((slot, index) => (
                <li key={index} className="flex items-center justify-between text-sm text-gray-300">
                  <span className="bg-gray-700 px-3 py-1 rounded-full mr-2">{slot}</span>
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="text-red-500 hover:text-red-600 ml-2"
                    aria-label={`Remove slot ${slot}`}
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
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-500 file:text-white hover:file:bg-red-600"
              aria-label="Upload Stadium Image"
            />
            {imagePreview && (
              <div className="mt-2 flex flex-col items-center">
                <img src={imagePreview} alt="Preview" className="w-40 h-28 object-cover rounded-lg border border-gray-500 shadow-md" />
                <button type="button" onClick={() => { setImage(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="mt-2 px-3 py-1 bg-red-700 text-white rounded-full text-xs hover:bg-red-800">Remove Image</button>
              </div>
            )}
          </div>

          {errorMsg && <div className="bg-red-700 text-white p-2 rounded text-center text-xs">{errorMsg}</div>}
          {successMsg && <div className="bg-green-600 text-white p-2 rounded text-center text-xs">{successMsg}</div>}

          <motion.button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-full transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Submit Stadium"
            disabled={loading}
          >
            {loading ? (<span className="animate-spin mr-2">⏳</span>) : 'Submit Stadium'}
          </motion.button>

          <div className="text-center mt-4">
            <Link to="/" className="text-gray-300 hover:text-red-400 transition duration-300 text-sm">
              ← Back to Home
            </Link>
          </div>
        </form>
      </motion.div>

      {/* Modal Summary */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-red-700"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Confirm Stadium Details</h2>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li><span className="font-semibold">Name:</span> {stadiumName}</li>
                <li><span className="font-semibold">Region:</span> {region}</li>
                <li><span className="font-semibold">Slots:</span> {slots.join(', ')}</li>
                {imagePreview && <li><span className="font-semibold">Image:</span><img src={imagePreview} alt="Preview" className="w-24 h-16 object-cover rounded-lg inline-block ml-2" /></li>}
              </ul>
              <div className="flex gap-4 justify-center mt-6">
                <button
                  onClick={handleFinalSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold transition"
                  disabled={loading}
                  aria-label="Confirm Stadium"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* End Modal Summary */}

      {/* Live Preview */}
      <AnimatePresence>
  {(stadiumName || region || slots.length > 0 || imagePreview) && (
    <motion.div
      className="w-full max-w-lg bg-black/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10 text-white space-y-4"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Preview</h2>

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative w-full h-60 rounded-lg overflow-hidden">
          <img
            src={imagePreview}
            alt="Stadium Preview"
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* Stadium Details */}
      <div className="space-y-2">
        <p><span className="font-semibold">Name:</span> {stadiumName}</p>
        <p><span className="font-semibold">Region:</span> {region}</p>
        {slots.length > 0 && (
          <div>
            <span className="font-semibold">Slots:</span> {slots.join(', ')}
          </div>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>
      {/* End Live Preview */}
    </div>
  );
}

export default AddStadium;
