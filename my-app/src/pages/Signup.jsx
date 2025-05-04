import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: '',
    cin: '',
    phone: '',
    agreeToTerms: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agreeToTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', form.name);
      formData.append('email', form.email);
      formData.append('password', form.password);
      if (form.birthdate) {
        const date = new Date(form.birthdate);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        formData.append('birthday', `${yyyy}-${mm}-${dd}`);
      }
      if (form.cin) {
        formData.append('cin', String(form.cin).replace(/\D/g, ''));
      }
      formData.append('phoneNumber', form.phone);

      const response = await axios.post('http://localhost:8081/api/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("Registration successful:", response.data);
      alert("Account created successfully!");
      navigate('/login');
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-800 text-white px-4">
      <form onSubmit={handleSubmit} className="bg-black p-8 rounded-xl shadow-2xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />

        <input
          type="date"
          name="birthdate"
          value={form.birthdate}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />

        <input
          type="text"
          name="cin"
          placeholder="CIN Number"
          value={form.cin}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="+216 XX XXX XXX"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          pattern="\+216[0-9]{8}"
          required
        />

        <div className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={form.agreeToTerms}
            onChange={handleChange}
            className="form-checkbox text-red-500 bg-gray-800 border-gray-600 focus:ring-red-500"
          />
          <label htmlFor="agreeToTerms" className="text-gray-300">
            I agree to the <Link to="/terms" className="text-red-400 hover:text-red-600 underline">Terms and Conditions</Link>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition duration-300"
        >
          Sign Up
        </button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-red-400 hover:text-red-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
