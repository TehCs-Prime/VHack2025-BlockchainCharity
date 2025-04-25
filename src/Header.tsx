import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { NavLink } from "react-router-dom"
import './Header.css'
import Logo from '/assets/vhack-logo-white.png'

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
    <header className="px-12 py-4 bg-[#ffc014] shadow-md sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between mx-auto">
        {/* Logo Section */}
        <NavLink to="/">
          <img src={Logo} alt="LaCial" className="h-6" />
        </NavLink>

        <nav className="">
          <ul className="flex list-none gap-20 text-sm font-semibold text-gray-800">
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
        <div className="flex items-center text-sm font-semibold text-[#ffc014]">
          {userData ? (
            <div className="flex items-center gap-6">
              <Link 
                to={profileRoute}
                className="border-2 rounded-full border-white bg-transparent text-white px-5 py-1 transition-all duration-300 hover:bg-white hover:text-[#ffc014]"
                state={{ from: location.pathname }}
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout} 
                className="cursor-pointer border-2 rounded-full border-red-600 bg-transparent text-red-600 px-5 py-1 transition-all duration-300 hover:bg-red-600 hover:text-white"
                aria-label="Log out"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link 
                to="/login" 
                className="border-2 rounded-full border-white bg-transparent text-white px-5 py-1 transition-all duration-300 hover:bg-white hover:text-[#ffc014]"
                state={{ from: location.pathname }}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="border-2 rounded-full border-white bg-transparent text-white px-5 py-1 transition-all duration-300 hover:bg-white hover:text-[#ffc014]"
                state={{ from: location.pathname }}
              >
                Sign&nbsp;Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header