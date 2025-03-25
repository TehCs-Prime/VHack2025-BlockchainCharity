import React, { useState } from 'react';
import './Overlay-DonationFlow.css';

interface OverlayDonationFlowProps {
  onClose: () => void;
  projectName?: string;
}

const exchangeRates: { [key: string]: { [key: string]: number } } = {
  BNB: { MYR: 1500, USD: 320 },
  BTC: { MYR: 250000, USD: 55000 },
  ETH: { MYR: 17000, USD: 3800 },
};

const OverlayDonationFlow: React.FC<OverlayDonationFlowProps> = ({ onClose, projectName }) => {
  const [step, setStep] = useState<'donation' | 'info' | 'wallet' | 'appreciation'>('donation');
  const [donationData, setDonationData] = useState({
    cryptoAmount: '',
    cryptoType: 'BNB',
    fiatAmount: '',
    fiatType: 'MYR',
    name: '',
    email: '',
    message: '',
    network: 'erc20',
    displayName: false, 
    marketingUpdates: false,
  });
  
  const [isChecked, setIsChecked] = useState(false);

  const getExchangeRate = (crypto: string, fiat: string): number => {
    return exchangeRates[crypto]?.[fiat] || 1;
  };

  const handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDonationData((prev) => ({
      ...prev,
      cryptoAmount: value,
      fiatAmount: value ? (parseFloat(value) * getExchangeRate(prev.cryptoType, prev.fiatType)).toFixed(2) : '',
    }));
  };
  
  const handleFiatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDonationData((prev) => ({
      ...prev,
      fiatAmount: value,
      cryptoAmount: value ? (parseFloat(value) / getExchangeRate(prev.cryptoType, prev.fiatType)).toFixed(6) : '',
    }));
  };
  
  const handleBackStep = () => {
    if (step === 'info') setStep('donation');
    else if (step === 'wallet') setStep('info');
    else if (step === 'appreciation') setStep('wallet');
  };
  
  const handleNextStep = () => {
    if (step === 'donation' && !isChecked) return;
    if (step === 'donation') setStep('info');
    else if (step === 'info') setStep('wallet');
    else if (step === 'wallet') setStep('appreciation');
    else onClose();
  };


  return (
    <div className="overlay-container" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>

        {step === 'donation' && (
          <div className="step-donation">
            <div className="modal-header">
              <button className="close-btn" onClick={onClose}>&times;</button>
              <h2>Donate to {projectName}</h2>
            </div>
            <div className="form-group">
              <label>Crypto Amount</label>
              <input
                type="number"
                placeholder="Enter crypto amount"
                value={donationData.cryptoAmount}
                onChange={handleCryptoChange}
              />
              <select
                value={donationData.cryptoType}
                onChange={(e) => setDonationData({ ...donationData, cryptoType: e.target.value })}
              >
                <option value="BNB">BNB</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fiat Equivalent</label>
              <input
                type="number"
                placeholder="0.00"
                value={donationData.fiatAmount}
                onChange={handleFiatChange}
              />
              <select
                value={donationData.fiatType}
                onChange={(e) => setDonationData({ ...donationData, fiatType: e.target.value })}
              >
                <option value="MYR">MYR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div className="agreement">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label htmlFor="terms-checkbox">
                By proceeding with the donation, you agree with our
                <a href="#" target="_blank"> Terms of Use</a> and
                <a href="#" target="_blank"> Privacy Policy</a>.
              </label>
            </div>

            <button className="next-btn" onClick={handleNextStep} disabled={!isChecked}>
              Continue
            </button>
          </div>
        )}


{step === 'info' && (
  <div className="step-info">
    <div className="modal-header">
      <button className="back-btn" onClick={handleBackStep}>⬅</button>
      <h2>Enter Your Information</h2>
      <button className="close-btn" onClick={onClose}>&times;</button>
    </div>

    <div className="form-group">
      <label>Name</label>
      <input
        type="text"
        placeholder="Enter your name"
        value={donationData.name}
        onChange={(e) => setDonationData({ ...donationData, name: e.target.value })}
      />
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="displayName"
          checked={donationData.displayName}
          onChange={(e) => setDonationData({ ...donationData, displayName: e.target.checked })}
        />
        <label htmlFor="displayName">Display my name on donation page.</label>
      </div>
    </div>

    <div className="form-group">
      <label>Email</label>
      <input
        type="email"
        placeholder="Enter your email"
        value={donationData.email}
        onChange={(e) => setDonationData({ ...donationData, email: e.target.value })}
      />
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="marketingUpdates"
          checked={donationData.marketingUpdates}
          onChange={(e) => setDonationData({ ...donationData, marketingUpdates: e.target.checked })}
        />
        <label htmlFor="marketingUpdates">I agree to receive marketing updates.</label>
      </div>
    </div>

    <div className="form-group">
      <label>Message</label>
      <textarea
        placeholder="Enter your message"
        value={donationData.message}
        onChange={(e) => setDonationData({ ...donationData, message: e.target.value })}
      />
    </div>

    <button className="next-btn" onClick={handleNextStep}>Continue</button>
  </div>
)}


{step === 'wallet' && (
  <div className="step-transaction">
    <div className="modal-header">
      <button className="back-btn" onClick={handleBackStep}>←</button>
      <h2>Complete Your Transaction</h2>
      <button className="close-btn" onClick={onClose}>&times;</button>
    </div>        

    <p>Amount: <span>{donationData.cryptoAmount} {donationData.cryptoType}</span></p>
    <p>Equivalent to: <span>{donationData.fiatAmount} {donationData.fiatType}</span></p>

    <div className="transaction-details">
      <p><span style={{ fontWeight: 'bold' }}>Payment Method:</span> Crypto Wallet</p>
      <p><span style={{ fontWeight: 'bold' }}>Donate to:</span> {projectName || "Unknown Project"}</p>
    </div>

    <div className="form-group">
      <label>Network</label>
      <select
  value={donationData.network}
  onChange={(e) => setDonationData({ ...donationData, network: e.target.value })}
>
  <option value="erc20">Ethereum</option>
  <option value="bep20">BNB Chain</option>
  <option value="polygon">Polygon</option>
</select>

    </div>

    <button className="connect-btn" onClick={handleNextStep}>Connect Wallet</button>
  </div>
)}


{step === 'appreciation' && (
  <div className="step-appreciation">
    <div className="modal-header">
      <button className="close-btn" onClick={onClose}>✖</button>
      <button className='baack-btn' onClick={handleBackStep}>⬅</button>
    </div>

    {/* Add Thank You Image */}
    <img src="\assets\appreciation.png" alt="Thank You" className="thank-you-logo" />

    <h2 className="thank-you-message">Thank You for Your Kindness!</h2>

    <div className="donation-summary">
      <p>Amount: {donationData.cryptoAmount} {donationData.cryptoType}</p>
      <p>Equivalent: {donationData.fiatAmount} {donationData.fiatType}</p>
      <p><span style={{ fontWeight: 'bold' }}>{projectName || "Unknown Project"}</span></p>
    </div>

    {/* Add TxID Message */}
    <p className="txid-message">
      Your donation records will be shown on the website after the TxID is verified.
    </p>

    {/* Display donor message */}
    <div className="donation-card">
      <p>{donationData.message || 'No message provided'}</p>
    </div>

    {/* Add Processing Note */}
    <p className="note">
      *Please note donations may not be reflected on the website or calculated in the total amount immediately. If your donation is missing, check back later.
    </p>

    <button className="done-btn" onClick={onClose}>Done</button>
  </div>
)}


      </div>
    </div>
  );
};

export default OverlayDonationFlow;
