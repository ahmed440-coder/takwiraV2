import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:8081/api/auth/login', {
        email, password
      });

      setUser(res.data);
      localStorage.setItem('token', JSON.stringify(res.data));
      const token = localStorage.getItem('token');
      console.log("user logged in with the token : ",token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Invalid credentials');
    }
  };

  const logout = async () => {
    try {
      console.log(user);
      axios.post('http://localhost:8081/api/auth/logout', undefined, {
        headers: {
          Authorization: `Bearer ${user}`,
        }
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    setUser(null);
    localStorage.removeItem('token');
    alert("user is out !");
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
