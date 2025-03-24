// src/pages/Settings.tsx
import "./Settings.css";
import {
  FaCreditCard,
  FaBitcoin,
  FaEdit,
  FaBell,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";
import { useState } from "react";

export default function Settings() {
  // State for email notifications toggle
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);

  // State for selected language
  const [language, setLanguage] = useState<string>("en");

  // Handle toggle switch change
  const handleToggle = () => {
    setEmailNotifications((prev) => !prev);
  };

  // Handle language selection change
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <div className="settings-header">
          <h2>Account Settings</h2>
          <p className="settings-subtitle">
            Manage your account preferences and security settings
          </p>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <FaCreditCard className="section-icon" />
            <h3>Payment Methods</h3>
          </div>
          <div className="setting-item">
            <div className="item-content">
              <FaCreditCard className="item-icon" />
              <div>
                <p className="item-title">Credit/Debit Cards</p>
                <p className="item-subtitle">2 cards linked</p>
              </div>
            </div>
            <button className="manage-btn">
              <FaEdit className="btn-icon" />
              Manage
            </button>
          </div>
          <div className="setting-item">
            <div className="item-content">
              <FaBitcoin className="item-icon" />
              <div>
                <p className="item-title">Crypto Wallets</p>
                <p className="item-subtitle">3 wallets connected</p>
              </div>
            </div>
            <button className="manage-btn">
              <FaEdit className="btn-icon" />
              Manage
            </button>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <FaBell className="section-icon" />
            <h3>Subscription Settings</h3>
          </div>
          <div className="preference-item">
            <div className="toggle-group">
              <FaEnvelope className="toggle-icon" />
              <label className="toggle-label">
                <span className="toggle-text">Email Notifications</span>
                <span className="toggle-subtext">Receive subscription updates</span>
              </label>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={handleToggle}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* New Language Selection Section */}
        <div className="settings-section">
          <div className="section-header">
            <FaGlobe className="section-icon" />
            <h3>Language Preferences</h3>
          </div>
          <div className="language-selector">
            <div className="toggle-group">
              <FaGlobe className="toggle-icon" />
              <label className="toggle-label">
                <span className="toggle-text">Website Language</span>
                <span className="toggle-subtext">Choose your preferred language</span>
              </label>
            </div>
            <select
              className="language-dropdown"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
