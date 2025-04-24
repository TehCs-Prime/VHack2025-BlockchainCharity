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

  // Determine which profile route to navigate to based on the user's role
  const profileRoute = user && user.role === 'charity' ? '/charity-profile' : '/profile'

  return (
    <header className="px-12 py-4 bg-[#ffc014] shadow-md sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between mx-auto">
        {/* Logo Section */}
        <NavLink to="/">
          <img src={Logo} alt="LaCial" className="h-6" />
        </NavLink>

        <nav className="">
          <ul className="flex list-none gap-20 text-sm font-semibold text-gray-800">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/explore" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Explore</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/approach" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>How We Works</NavLink>
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
        <div className="flex items-center text-sm font-semibold text-[#ffc014]">
          {user ? (
            <div className="flex items-center gap-6">
              <Link to={profileRoute} className="login-link">Profile</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="border-2 rounded-full border-white bg-white px-5 py-1 transition-all duration-300 hover:bg-white hover:text-[#ffc014]">Login</Link>
              <Link to="/signup" className="border-2 rounded-full border-white bg-white px-5 py-1 transition-all duration-300 hover:bg-white hover:text-[#ffc014]">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header;
