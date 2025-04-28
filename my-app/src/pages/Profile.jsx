import React, { useState } from 'react';
import { FaUserEdit, FaCamera } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+216 12 345 678',
    birthdate: '1995-06-15',
    cin: '12345678',
    photo: null,
  });

  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditing(false);

    // Save user data to localStorage
    localStorage.setItem('userProfile', JSON.stringify(user));

    // Save profile logic here
    console.log(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-800 text-white flex items-center justify-center px-4 py-10 pt-40">
      <div className="w-full max-w-3xl bg-black p-8 rounded-xl shadow-2xl space-y-6">
        <h2 className="text-3xl font-bold text-center">My Profile</h2>

        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <img
              src={preview || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-red-500"
            />
            <label className="absolute bottom-0 right-0 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={!editing}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={!editing}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={!editing}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={user.birthdate}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={!editing}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">CIN Number</label>
            <input
              type="text"
              name="cin"
              value={user.cin}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={!editing}
            />
          </div>

          <div className="md:col-span-2 flex justify-end space-x-4 mt-6">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="py-2 px-6 bg-gray-600 hover:bg-gray-700 rounded text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="py-2 px-6 bg-red-600 hover:bg-red-700 rounded text-white font-semibold flex items-center space-x-2"
              >
                <FaUserEdit /> <span>Edit Profile</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
