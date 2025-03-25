import React from 'react';
import './Page-Approach.css';

const DonorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
      <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097c.504.542.92 1.195 1.094 1.982a.75.75 0 00.584.626c5.562.814 11.084.814 16.646 0a.75.75 0 00.584-.626c.174-.787.59-1.44 1.094-1.982zm-3.027-3.557L12 14.25l-3.658-2.71a.75.75 0 11.916-1.182l2.742 2.027V6.75a.75.75 0 011.5 0v4.365l2.742-2.027a.75.75 0 01.916 1.182z" clipRule="evenodd" />
    </svg>
  );
  
  const BinanceCharityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
      <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.172-2.756 9.707 9.707 0 00-3.521-2.02 9.734 9.734 0 00-5.361-.031 9.758 9.758 0 00-3.441 1.987 12.88 12.88 0 01-4.178 2.756 9.716 9.716 0 00-.948 5.003 9.765 9.765 0 004.178 7.447 12.794 12.794 0 014.172 2.758 9.736 9.736 0 005.367.031 9.762 9.762 0 003.494-1.987 12.758 12.758 0 014.165-2.758 9.765 9.765 0 00.95-7.447zM14.122 9.492a11.295 11.295 0 01-3.146 2.192l-.005.002-.005.003c-.902.534-1.259 1.387-1.938 2.049a.75.75 0 01-.527.224h-.003a.75.75 0 01-.53-1.279 3.72 3.72 0 00.693-.645c.655-.744 1.349-1.465 1.594-2.477a4.002 4.002 0 00-7.418-1.871.75.75 0 11-1.326-.666 5.5 5.5 0 019.813 3.518c.242.72.627 1.395 1.066 2.012a.75.75 0 01-.53 1.184z" />
    </svg>
  );
  
  const LocalNGOIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
      <path d="M10.464 8.746c.227-.18.497-.311.795-.394v2.795a2.252 2.252 0 01-.795-.393c-.17-.17-.279-.4-.279-.641 0-.242.109-.472.279-.641zm1.536.394c.297.083.567.214.795.393.17.17.279.4.279.641 0 .242-.109.472-.279.641a2.284 2.284 0 01-.795.393V9.14zm2.094-2.061a.75.75 0 10-1.06-1.06.75.75 0 001.06 1.06zM7.151 8.284a.75.75 0 001.06-1.06.75.75 0 00-1.06 1.06zM12 2.25a.75.75 0 01.75.75v.756a8.257 8.257 0 00-5.636 2.106.75.75 0 11-1.06-1.06A9.758 9.758 0 0112 3v-.75zm0 5.25a.75.75 0 01.75.75 3.74 3.74 0 003.338 3.697 6.737 6.737 0 00-1.622 4.53v.75h-1.5v-.75a5.24 5.24 0 011.005-3.06.75.75 0 00-.675-1.182A6.753 6.753 0 0112 7.5a.75.75 0 01.75-.75zM12 15l2.817-2.817a.75.75 0 100-1.06L12 12.94l-2.817-2.817a.75.75 0 10-1.06 1.06L10.94 14l-2.817 2.817a.75.75 0 101.06 1.06L12 15.06l2.817 2.817a.75.75 0 101.06-1.06L13.06 14l2.817-2.817a.75.75 0 10-1.06-1.06L12 12.94 9.183 10.122a.75.75 0 00-1.06 1.06L10.94 14z" />
    </svg>
  );

const ApproachPage: React.FC = () => {
  return (
    <div className="approach-container">
      <div className="approach-stats">
        <div className="stat">
          <h2>1,253,643 🏘️</h2>
          <p>Total Beneficiaries</p>
        </div>
        <div className="stat">
          <h2>5,335 🎗️</h2>
          <p>Amount Donations</p>
        </div>
        <div className="stat">
          <h2>1,353 BTC 🪙</h2>
          <p>Bitcoin Donations Raised</p>
        </div>
      </div>
      
      <div className="approach-content">
        <div className="approach-section">
          <div className="approach-card">
            <h3>Direct Giving</h3>
            <p>We transfer your donation directly to the end beneficiary - meaning 100% of your money goes to those who need it most.</p>
          </div>
          
          <div className="approach-card">
            <h3>Transformative Tech</h3>
            <p>We believe tech should serve people so we repurpose emerging tech as tools for social change.</p>
          </div>
        </div>
        
        <div className="approach-section">
          <div className="approach-card">
            <h3>Transparency</h3>
            <p>We revolutionize global giving by making it more transparent to address challenges facing the social sector such as corruption, lack of trust in nonprofits, high global transfer fees, inefficient processes and lack of accountability in donor spending.</p>
          </div>
          
          <div className="approach-card">
            <h3>Research</h3>
            <p>To better understand and support Web 3 solutions, we invest in the innovation, research and development of it.</p>
          </div>
        </div>
        
        <div className="donate-buttons">
          <button><a href='./explore'>Donate Now</a></button>
        </div>
      </div>

      <div className='intro-container'>
      <div className='approach-intro-img'>
        <img src='/assets/LoveHand-removebg-preview.png'></img>
      </div>

        <div className='intro-words'>
          <div className='intro-title'>Pioneering Solutions for Social Transformation</div>
          <div className='intro-des'>We as <strong>LaCial Charity</strong>, a non-profit organization dedicated to empower communities with Web3 Blockchain technology.</div>
        </div>

      </div>

      <div className="donation-flow-container">
        <div className='donation-flow-header'>
            <h1>Donation Flow</h1>
            <div className="donation-flow-buttons">
                <button className="ngo-button active">
                Donor
                </button>

                <div className="arrow">
                    <span>»</span>
                </div>

                <button className="ngo-button active">
                LaCial Charity
                </button>

                <div className="arrow">
                    <span>»</span>
                </div>

                <button className="ngo-button active">
                NGOs
                </button>
            </div>
        </div>
      
      
      <div className="donation-flow-steps">
        <div className="donation-step">
          <div className="step-icon">
            <DonorIcon />
          </div>
          <div className="step-description">
            <h3>Donor gives to Binance Charity in crypto.</h3>
          </div>
        </div>
        
        <div className="arrow">
          <span>»</span>
        </div>
        
        <div className="donation-step">
          <div className="step-icon">
            <BinanceCharityIcon />
          </div>
          <div className="step-description">
            <h3>Binance Charity provides a grant in crypto to local NGOs.</h3>
          </div>
        </div>
        
        <div className="arrow">
          <span>»</span>
        </div>
        
        <div className="donation-step">
          <div className="step-icon">
            <LocalNGOIcon />
          </div>
          <div className="step-description">
            <h3>Local NGOs can then use crypto to buy goods or cash-out to their local currency.</h3>
          </div>
        </div>

        <div className="arrow">
          <span>»</span>
        </div>

        <div className="donation-step">
          <div className="step-icon">
            <DonorIcon />
          </div>
          <div className="step-description">
            <h3>Donor gives to Binance Charity in crypto.</h3>
          </div>
        </div>
      </div>
    </div>

    </div>
  );
};

export default ApproachPage;