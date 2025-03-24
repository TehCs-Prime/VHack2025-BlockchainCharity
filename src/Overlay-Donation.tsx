import React, { useState } from 'react';
import './Overlay-Donation.css';
import OverlayDonationInfo from './Overlay-DonationInfo';

interface OverlayProps {
  onClose: () => void;
  onDonate: (cryptoAmount: number, cryptoCurrency: string, fiatAmount: number, fiatCurrency: string) => void;
  projectName?: string;
}

const exchangeRates: { [key: string]: { [key: string]: number } } = {
  BNB: { MYR: 1500, USD: 320 },
  BTC: { MYR: 250000, USD: 55000 },
  ETH: { MYR: 17000, USD: 3800 },
};


const OverlayDonation: React.FC<OverlayProps> = ({ onClose, onDonate, projectName }) => {
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('BNB');
  const [fiatAmount, setFiatAmount] = useState('');
  const [selectedFiat, setSelectedFiat] = useState('MYR');
  const [lastUpdatedField, setLastUpdatedField] = useState<'crypto' | 'fiat'>('crypto');
  const [isChecked, setIsChecked] = useState(false);

  const getExchangeRate = (crypto: string, fiat: string): number => {
    return exchangeRates[crypto]?.[fiat] || 1;
  };

  const handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCryptoAmount(value);
    setLastUpdatedField('crypto');

    if (value) {
      const rate = getExchangeRate(selectedCrypto, selectedFiat);
      setFiatAmount((parseFloat(value) * rate).toFixed(2));
    } else {
      setFiatAmount('');
    }
  };

  const handleFiatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFiatAmount(value);
    setLastUpdatedField('fiat');

    if (value) {
      const rate = getExchangeRate(selectedCrypto, selectedFiat);
      setCryptoAmount((parseFloat(value) / rate).toFixed(6));
    } else {
      setCryptoAmount('');
    }
  };

  const handleCryptoCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCrypto = e.target.value;
    setSelectedCrypto(newCrypto);

    const rate = getExchangeRate(newCrypto, selectedFiat);
    if (lastUpdatedField === 'crypto' && cryptoAmount) {
      setFiatAmount((parseFloat(cryptoAmount) * rate).toFixed(2));
    } else if (lastUpdatedField === 'fiat' && fiatAmount) {
      setCryptoAmount((parseFloat(fiatAmount) / rate).toFixed(6));
    }
  };

  const handleFiatCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFiat = e.target.value;
    setSelectedFiat(newFiat);

    const rate = getExchangeRate(selectedCrypto, newFiat);
    if (lastUpdatedField === 'crypto' && cryptoAmount) {
      setFiatAmount((parseFloat(cryptoAmount) * rate).toFixed(2));
    } else if (lastUpdatedField === 'fiat' && fiatAmount) {
      setCryptoAmount((parseFloat(fiatAmount) / rate).toFixed(6));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const handleContinue = () => {
    if (!isChecked) return;

    // Convert string values to numbers
    const cryptoAmt = parseFloat(cryptoAmount);
    const fiatAmt = parseFloat(fiatAmount);

    if (!cryptoAmt || !fiatAmt) return;

    // Call onDonate before showing the next overlay
    onDonate(cryptoAmt, selectedCrypto, fiatAmt, selectedFiat);
    
    // Show the next overlay
    setShowDonationInfo(true);
  };

  if (showDonationInfo) {
    return <OverlayDonationInfo onClose={onClose} />;
  }

  return (
    <div className="donation-overlay">
      <div className="overlay-content">
        <div className="modal-header">
          <h2>Donate to</h2>
          <p>{projectName}</p>
          <button className="close-btn" onClick={onClose}>&times;</button> {/* Close Button */}
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select className="select-box" disabled>
              <option>Pay with Wallet</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Crypto</label>
            <div className="flex-row">
              <input
                type="number"
                className="input-box"
                placeholder="0.00"
                min="0"
                step="any"
                value={cryptoAmount}
                onChange={handleCryptoChange}
              />
              <select className="select-box" value={selectedCrypto} onChange={handleCryptoCurrencyChange}>
                <option value="BNB">BNB</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Amount</label>
            <div className="flex-row">
              <input
                type="number"
                className="input-box"
                placeholder="0.00"
                min="0"
                step="any"
                value={fiatAmount}
                onChange={handleFiatChange}
              />
              <select className="select-box" value={selectedFiat} onChange={handleFiatCurrencyChange}>
                <option value="MYR">MYR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div className="agreement">
            <input type="checkbox" id="terms-checkbox" checked={isChecked} onChange={handleCheckboxChange} />
            <label htmlFor="terms-checkbox">
              By proceeding with the donation, you agree with our
              <a href="#" target="_blank"> Terms of Use</a> and
              <a href="#" target="_blank"> Privacy Policy</a>.
            </label>
          </div>

          <button className="continue-btn" onClick={handleContinue} disabled={!isChecked}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverlayDonation;
