import React from 'react';
import './Footer.css';
import Logo from '/assets/Logo.png'

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section logo-section">
          <div className="lacial-logo-container">

            <div className="lacial-logo">
              <img src={Logo} alt='Logo' />
              <span className="text-xl font-semibold text-yellow-400 pt-1">LACIAL CHARITY</span>
            </div>

            <div className="subscription-container">
              <p className="subscription-text">Subscribe to receive our latest news and updates.</p>
              <div className="subscription-form">
                <input type="email" placeholder="Email address" className="subscription-input" />
                <button type="submit" className="subscription-button">Subscribe</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">INFORMATION</h3>
          <ul className="footer-links">
            <li><a href="/faqs">FAQs</a></li>
            <li><a href="/WhoRwe">About Us</a></li>
            <li><a href="/terms">Terms of Use</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/privacy">Cookie Policy</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-heading">CONTACT US</h3>
          <div className="contact-item">
            <h4>General Inquiry</h4>
            <a href="mailto:contact@binance.org">contact@lacial.org</a>
          </div>
          <div className="contact-item">
            <h4>Media Inquiry</h4>
            <a href="mailto:ngo@binance.org">media@lacial.org</a>
          </div>
          <div className="contact-item">
            <h4>Technical Help</h4>
            <a href="mailto:support@binance.org">support@lacial.org</a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">FOLLOW US</h3>
          <div className="social-icons">
            <a href="#" className="social-icon" aria-label="Instagram">
            <img src="/assets/instagram-alt-logo-black.png" alt="Instagram" />
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
            <img src="/assets/twitter-logo-black.png" alt="Twitter" />
            </a>
            <a href="#" className="social-icon" aria-label="Facebook">
            <img src="/assets/facebook-logo-black.png" alt="Facebook" />
            </a>
          </div>
        </div>
      </div>

      <div className='border-[1px] border-white/30 w-full'></div>

      <div className="bg-[#111] text-center text-xs py-3 opacity-80 footer-bottom">
        <p>Copyright 2025 | All Rights Reserved by Lacial</p>
      </div>

    </footer>
  );
};

export default Footer;