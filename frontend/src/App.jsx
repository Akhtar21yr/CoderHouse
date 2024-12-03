import React from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navigation from './components/shared/Navigation/Navigation'
import Authenticate from './pages/Authenticate/Authenticate'
import Activate from './pages/Activate/Activate'
import Room from './pages/Rooms/Rooms'

const App = () => {
  const isAuth = false;
  const isActive = false;

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<GuestRoute isAuth={isAuth} isActive={isActive}><Home /></GuestRoute>} />
        <Route path="/authenticate" element={<GuestRoute isAuth={isAuth} isActive={isActive}><Authenticate /></GuestRoute>} />
        <Route path="/activate" element={<SemiProtectedRoute isAuth={isAuth} isActive={isActive}><Activate /></SemiProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute isAuth={isAuth} isActive={isActive}><Room /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

const GuestRoute = ({ children, isAuth, isActive }) => {
  if (isAuth) {
    if (isActive) {
      return <Navigate to="/rooms" />;
    }
    return <Navigate to="/activate" />;
  }
  return children;
};

const SemiProtectedRoute = ({ children, isAuth, isActive }) => {
  if (!isAuth) {
    return <Navigate to="/" />;
  }
  if (isAuth && !isActive) {
    return children;
  }
  return <Navigate to="/rooms" />;
};

const ProtectedRoute = ({ children, isAuth, isActive }) => {
  if (!isAuth) {
    return <Navigate to="/" />;
  }
  if (isAuth && !isActive) {
    return <Navigate to="/activate" />;
  }
  return children;
};

export default App;
