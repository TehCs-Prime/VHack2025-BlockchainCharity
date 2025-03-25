import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './Overlay-DonationFlow.css';

declare global {
  interface Window {
    ethereum?: any;
  }
}

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
  const { user } = useAuth();
  const [step, setStep] = useState<'donation' | 'info' | 'wallet' | 'appreciation'>('donation');
  
  useEffect(() => {
    if (user) {
      setDonationData(prev => ({
        ...prev,
        name: user.username,
        email: user.email
      }));
    }
  }, [user]);
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
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');
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
  
  // Check if MetaMask is installed
const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
};

// Connect to MetaMask wallet
const connectWallet = async () => {
  if (!isMetaMaskInstalled()) {
    setError('MetaMask is not installed. Please install it to continue.');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setWalletAddress(accounts[0]);
    setWalletConnected(true);
    setError('');
    // For prototype, just proceed to next step after connecting
    setStep('appreciation');
  } catch (err) {
    setError('Failed to connect wallet: ' + (err as Error).message);
  }
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
    else if (step === 'wallet') connectWallet(); // This now calls connectWallet
    else onClose();
  };


  return (
    <div className="overlay-container" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>

        {step === 'donation' && (
          <div className="step-donation">
            <div className="modal-header">
              <h2>Donate to {projectName}</h2>
              <button className="close-btn" onClick={onClose}>✖</button>
            </div>
            <div className="form-group">
              <label>Crypto Amount</label>
              <input
                type="number"
                placeholder="0.000000"
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
      <button className="close-btn" onClick={onClose}>✖</button>
    </div>

    <div className="form-group">
      <label>Name</label>
      <input
        type="text"
        placeholder="Enter your name"
        defaultValue={user?.username || ''}
        readOnly={!!user}
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
        defaultValue={user?.email || ''}
        readOnly={!!user}
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
      <button className="close-btn" onClick={onClose}>✖</button>
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

    {walletConnected ? (
      <div className="wallet-info">
        <p>Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</p>
      </div>
    ) : (
      <button className="connect-btn" onClick={connectWallet}>
        Connect Wallet
      </button>
    )}

    {error && <div className="error-message">{error}</div>}
  </div>
)}


{step === 'appreciation' && (
  <div className="step-appreciation">
    <div className="modal-header">
      <button className='baack-btn' onClick={handleBackStep}>⬅</button>
      <button className="close-btn" onClick={onClose}>✖</button>
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
