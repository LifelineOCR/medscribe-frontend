// src/components/Header.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">MEDSCRIBE</div>
      <nav>
        <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>DASHBOARD</NavLink>
        <NavLink to="/upload" className={({ isActive }) => isActive ? "active" : ""}>UPLOAD</NavLink>
        <NavLink to="/records" className={({ isActive }) => isActive ? "active" : ""}>RECORDS</NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>SETTINGS</NavLink>
      </nav>
    </header>
  );
};

export default Header;