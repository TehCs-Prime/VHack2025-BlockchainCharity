import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { NavLink } from "react-router-dom";
import './Header.css'
import Logo from '/assets/Logo.png'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container">
        {/* Logo Section */}
        <div className="logo-container">
          <NavLink to="/">
            <img src={Logo} alt="LaCial" className="logo" />
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
              <NavLink to="/leaderboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Leaderboard</NavLink>
            </li>
          </ul>
        </nav>

        {/* Authentication Section */}
        <div className="auth-section">
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="profile-link">
                Profile
              </Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <div className="login-signup">
              <Link to="/login" className="login-link">Login</Link>
              <span className="divider">|</span>
              <Link to="/signup" className="signup-link">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header;
