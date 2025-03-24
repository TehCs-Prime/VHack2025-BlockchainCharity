import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import './Header.css'
import Logo from '/assets/Logo.png'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { label: 'Home', link: '/' },
    { label: 'Explore', link: '/explore' },
    { label: 'How We Do It', link: '/approach' },
    { label: 'Impact', link: '/impact' },
    { label: 'About Us', link: '/about' },
  ]

  return (
    <header className="header">
      <div className="container">
        {/* Logo Section */}
        <div className="logo-container">
          <Link to="/">
            <img src={Logo} alt="GiveMoney" className="logo" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="nav">
          <ul className="nav-list">
            {navItems.map((item, index) => (
              <li key={index} className="nav-item">
                <Link to={item.link} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
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

export default Header
