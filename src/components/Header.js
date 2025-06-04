import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

const Header = () => {
  const { isLoggedIn, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // This clears context and localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <header className="app-header">
      <NavLink to="/" className="logo">MEDSCRIBE</NavLink>
      <nav className="app-nav">
        {isLoggedIn ? (
          <>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>DASHBOARD</NavLink>
            <NavLink to="/upload" className={({ isActive }) => isActive ? "active" : ""}>UPLOAD</NavLink>
            <NavLink to="/records" className={({ isActive }) => isActive ? "active" : ""}>RECORDS</NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>SETTINGS</NavLink>
            {currentUser && currentUser.firstName && <span className="user-greeting">Hi, {currentUser.firstName}</span>}
            <button onClick={handleLogout} className="logout-button">LOGOUT</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>LOGIN</NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>REGISTER</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;