import React, { useState } from 'react';
import './Overlay-Donation.css';

interface OverlayDonationInfoProps {
  onClose: () => void;
  onConfirm: (name: string, email: string, message: string, displayName: boolean, marketingUpdates: boolean) => void;
}

const OverlayDonationInfo: React.FC<OverlayDonationInfoProps> = ({ onClose, onConfirm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [displayName, setDisplayName] = useState(false);
  const [marketingUpdates, setMarketingUpdates] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(name, email, message, displayName, marketingUpdates);
  };

  return (
    <div className="donation-overlay">
      <div className="overlay-content">
        <div className="modal-header">
          <button className="back-btn" onClick={onClose}>←</button>
          <h2>Donate Information</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="displayName"
              checked={displayName}
              onChange={(e) => setDisplayName(e.target.checked)}
            />
            <label htmlFor="displayName">Display my name on the donation page.</label>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="marketingUpdates"
              checked={marketingUpdates}
              onChange={(e) => setMarketingUpdates(e.target.checked)}
            />
            <label htmlFor="marketingUpdates">I agree to receive marketing updates.</label>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Enter your message"
            />
          </div>

          <button type="submit" className="continue-btn">Continue</button>
        </form>
      </div>
    </div>
  );
};

export default OverlayDonationInfo;
