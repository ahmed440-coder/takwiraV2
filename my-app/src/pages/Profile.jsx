import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaCamera } from 'react-icons/fa';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    cin: '',
    photo: null,
    photoUrl: '', // new field for existing photo URL
  });

  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');console.log("------",token)
        const response = await axios.get('http://localhost:8081/api/users/me', {
          headers: {Authorization:`Bearer ${token}`}
        });
        setUser(response.data);
        if (response.data.photoUrl) {
          setPreview(response.data.photoUrl);
        }
      } catch (err) {
        setError('Erreur lors du chargement du profil.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!user.name || !user.email.includes('@') || !user.phone || !user.birthdate || !user.cin) {
      setError('Veuillez remplir correctement tous les champs.');
      return;
    }

    setError(null);
    setEditing(false);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('email', user.email);
      formData.append('phone', user.phone);
      formData.append('birthdate', user.birthdate);
      formData.append('cin', user.cin);
      if (user.photo) {
        formData.append('photo', user.photo);
      }

      await axios.put('http://localhost:8081/api/users/me', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Optionally update localStorage
      localStorage.setItem('userProfile', JSON.stringify(user));
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour du profil.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-800 text-white flex items-center justify-center px-4 py-10 pt-40">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div className="w-full max-w-3xl bg-black p-8 rounded-xl shadow-2xl space-y-6">
          <h2 className="text-3xl font-bold text-center">My Profile</h2>

          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <img
                src={preview || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full border-4 border-red-500"
              />
              <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700">
                <FaCamera />
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={user.username}
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
                value={user.phoneNumber}
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
                value={user.birthday}
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
      )}
    </div>
  );
};

export default Profile;
