import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import AppRouter from './AppRouter';


function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Router>
  );
}

export default App;
