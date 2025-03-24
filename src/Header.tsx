import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import Logo from "/assets/Logo.png";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo-container">
          <NavLink to="/">
            <img src={Logo} alt="GiveMoney" className="logo" />
          </NavLink>
        </div>

        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/explore" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Explore</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/approach" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>How We Do It</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/impact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Impact</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About Us</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/leaderboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Leaderboard</NavLink>
            </li>
          </ul>
        </nav>

        <div className="login-signup">
          <NavLink to="/login" className={({ isActive }) => isActive ? "login-link active" : "login-link"}>Login</NavLink>
          <span className="divider">|</span>
          <NavLink to="/signup" className={({ isActive }) => isActive ? "signup-link active" : "signup-link"}>Sign Up</NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
