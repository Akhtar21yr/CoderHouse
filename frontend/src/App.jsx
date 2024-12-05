import React from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navigation from './components/shared/Navigation/Navigation'
import Authenticate from './pages/Authenticate/Authenticate'
import Activate from './pages/Activate/Activate'
import Room from './pages/Rooms/Rooms'
import { useSelector } from 'react-redux'

const App = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<RouteGuard redirectTo="/rooms" checkAuth={false} checkActive={false}><Home /></RouteGuard>} />
        <Route path="/authenticate" element={<RouteGuard redirectTo="/rooms" checkAuth={false} checkActive={false}><Authenticate /></RouteGuard>} />
        <Route path="/activate" element={<RouteGuard redirectTo="/rooms" checkAuth={true} checkActive={false}><Activate /></RouteGuard>} />
        <Route path="/rooms" element={<RouteGuard redirectTo="/" checkAuth={true} checkActive={true}><Room /></RouteGuard>} />
      </Routes>
    </BrowserRouter>
  );
};

// Centralized RouteGuard component
const RouteGuard = ({ children, redirectTo, checkAuth, checkActive }) => {
  const { isAuth, isActive } = useSelector(state => state.authSlice); // Destructuring directly

  if (checkAuth && !isAuth) {
    return <Navigate to="/" />;
  }

  if (checkActive && !isActive) {
    return <Navigate to="/activate" />;
  }

  if (!checkAuth && isAuth) {
    if (checkActive && !isActive) {
      return <Navigate to="/activate" />;
    }
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default App;
