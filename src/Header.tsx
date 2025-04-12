import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { NavLink } from "react-router-dom"
import './Header.css'
import Logo from '/assets/Logo.png'

const Header: React.FC = () => {
  const { userData, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logout()
      // Redirect to home page except if already on home
      if (location.pathname !== '/') {
        navigate('/')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Determine profile route based on user role
  const profileRoute = userData?.role === 'charity' 
    ? '/charity-profile' 
    : '/profile'

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
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/explore" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                Explore
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/approach" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                How We Work
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/impact" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                Impact
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                to="/leaderboard" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                Leaderboard
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Authentication Section */}
        <div className="auth-section">
          {userData ? (
            <div className="user-menu">
              <Link 
                to={profileRoute}
                className="profile-link"
                state={{ from: location.pathname }}
              >
                Profile
              </Link>
              <span className="divider">|</span>
              <button 
                onClick={handleLogout} 
                className="logout-btn"
                aria-label="Log out"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="login-signup">
              <Link 
                to="/login" 
                className="login-link"
                state={{ from: location.pathname }}
              >
                Login
              </Link>
              <span className="divider">|</span>
              <Link 
                to="/signup" 
                className="signup-link"
                state={{ from: location.pathname }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header