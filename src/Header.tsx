import React from 'react';
import './Header.css';
import Logo from "/assets/Logo.png";
import Explore from './Page-Explore';

const Header: React.FC = () => {
  const navItems = [
    { label: 'Home', link: '/' },
    { label: 'Explore', link: '/' },
    { label: 'How We Do It', link: '/approach' },
    { label: 'Impact', link: '/impact' },
    { label: 'About Us', link: '/about' },
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="logo-container">
          <a href="/">
            <img src={Logo} alt="GiveMoney" className="logo" />
          </a>
        </div>
        
        <nav className="nav">
          <ul className="nav-list">
            {navItems.map((item, index) => (
              <li key={index} className="nav-item">
                <a href={item.link} className="nav-link">{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        
          <div className="login-signup">
            <a href="/login" className="login-link">Login</a>
            <span className="divider">|</span>
            <a href="/signup" className="signup-link">Sign Up</a>
          </div>
      </div>
    </header>
  );
};

export default Header;