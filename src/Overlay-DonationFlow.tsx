// OverlayDonationFlow.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ethers } from 'ethers';
import { getCharityContract } from './hooks/useCharityContract';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import './Overlay-DonationFlow.css';

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

interface OverlayDonationFlowProps {
  onClose: () => void;
  projectName?: string;
  projectId: string;             // Firestore document ID of the project
  currentRaisedAmount: number;   // Current raised amount so far in project
  onDonationComplete?: () => void; // Callback to trigger after donation completion
}

// Exchange rates used to convert between crypto and fiat values
const exchangeRates: { [key: string]: { [key: string]: number } } = {
  BNB: { MYR: 1500, USD: 320 },
  BTC: { MYR: 250000, USD: 55000 },
  ETH: { MYR: 17000, USD: 3800 },
};

const OverlayDonationFlow: React.FC<OverlayDonationFlowProps> = ({
  onClose,
  projectName,
  projectId,
  currentRaisedAmount,
  onDonationComplete,
}) => {
  const { userData } = useAuth(); // Available if the user is signed in
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
    paymentMethod: 'wallet', // "wallet" for crypto, "card" for credit/debit card
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    displayName: false,
    marketingUpdates: false,
  });

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [processingDonation, setProcessingDonation] = useState(false);

  // Pre-fill name and email if userData exists.
  useEffect(() => {
    if (userData) {
      setDonationData((prev) => ({
        ...prev,
        name: userData.username || '',
        email: userData.email,
      }));
    }
  }, [userData]);

  // Function to return the exchange rate for the given crypto and fiat pair.
  const getExchangeRate = (crypto: string, fiat: string): number => {
    return exchangeRates[crypto]?.[fiat] || 1;
  };

  const handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDonationData((prev) => ({
      ...prev,
      cryptoAmount: value,
      fiatAmount: value
        ? (parseFloat(value) * getExchangeRate(prev.cryptoType, prev.fiatType)).toFixed(2)
        : '',
    }));
  };

  const handleFiatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDonationData((prev) => ({
      ...prev,
      fiatAmount: value,
      cryptoAmount: value
        ? (parseFloat(value) / getExchangeRate(prev.cryptoType, prev.fiatType)).toFixed(6)
        : '',
    }));
  };

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  };
  
  // Connect to MetaMask wallet and make donation
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install it to continue.');
      return;
    }
  
    try {
      // Connect wallet
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
      setWalletConnected(true);
      setError('');
  
      // Get contract instance
      const contract = await getCharityContract();
      
      // Convert crypto amount to wei
      const amountInWei = ethers.parseEther(donationData.cryptoAmount);
      
      // Call donate function (using campaignId 0 for now - should be passed as prop)
      console.log('Sending donation of', amountInWei.toString(), 'wei to campaign 0');
      const tx = await contract.donate(0, { value: amountInWei });
      console.log('Transaction submitted:', {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value.toString()
      });
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      if (!receipt) throw new Error('No transaction receipt received');
      
      console.log('Transaction mined:', {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'success' : 'failed'
      });
      
      // Try to verify contract state (optional)
      try {
        const campaign = await contract.getCampaign(0).catch(() => null);
        if (campaign) {
          console.log('Updated campaign state:', {
            totalDonated: campaign[3].toString(),
            donorAmount: (await contract.getDonationDetails(walletAddress, 0))[1].toString()
          });
        } else {
          console.log('Campaign 0 not found - skipping state verification');
        }
      } catch (err) {
        console.warn('State verification failed:', err);
      }
      
      // Proceed to thank you page
      setStep('appreciation');
      
      // Proceed to thank you page
      setStep('appreciation');
    } catch (err) {
      setError('Transaction failed: ' + (err as Error).message);
    }
  };

  // Step navigation functions
  const handleBackStep = () => {
    if (step === 'info') setStep('donation');
    else if (step === 'wallet') setStep('info');
    else if (step === 'appreciation') setStep('wallet');
  };

  const handleNextStep = () => {
    if (step === 'donation' && !isChecked) return; // Users must agree to the terms
    if (step === 'donation') setStep('info');
    else if (step === 'info') setStep('wallet');
    else if (step === 'wallet') {
      if (donationData.paymentMethod === 'wallet') {
        connectWallet();
      } else {
        // For card payments, you may later integrate a payment service.
        setStep('appreciation');
      }
    } else {
      // Final step: complete the donation.
      handleDonationComplete();
    }
  };

  // Handles donation completion:
  // 1. Composes a donation record with only the necessary fields depending on the payment method.
  // 2. Adds the record to Firestore.
  // 3. Updates the project's raised amount.
  // 4. Increments the donor count by 1.
  const handleDonationComplete = async () => {
    if (processingDonation) return;
    setProcessingDonation(true);

    // Build the donation record.
    let donationRecord: any = {
      donor: userData ? (userData.username || userData.email) : 'anonymous',
      message: donationData.message,
      projectId: projectId, // Must be a valid project document ID
      date: serverTimestamp(),
      paymentMethod: donationData.paymentMethod === 'card' ? 'card' : 'crypto',
    };

    if (donationData.paymentMethod === 'card') {
      // For card payments, include only fiat fields.
      donationRecord.fiatAmount = donationData.fiatAmount;
      donationRecord.fiatCurrency = donationData.fiatType;
    } else {
      // For crypto donations, include only crypto fields.
      donationRecord.cryptoAmount = donationData.cryptoAmount;
      donationRecord.cryptoType = donationData.cryptoType;
    }

    console.log("Submitting donation record:", donationRecord);
    console.log("User data:", userData);

    try {
      // Add the donation record to the 'donations' collection.
      await addDoc(collection(db, 'donations'), donationRecord);
      console.log("Donation record successfully added.");
    } catch (err) {
      console.error("Error adding donation record:", err);
      setError('Error adding donation record: ' + (err as Error).message);
    }

    try {
      // Calculate the additional raised amount.
      const additionalAmount =
        donationData.paymentMethod === 'card'
          ? donationData.fiatAmount
            ? parseFloat(donationData.fiatAmount)
            : 0
          : donationData.cryptoAmount
          ? parseFloat(donationData.cryptoAmount) *
            getExchangeRate(donationData.cryptoType, donationData.fiatType)
          : 0;

      const projectRef = doc(db, 'projects', projectId);
      // Update the project document: add to raisedAmount and increment donorsCount by 1.
      await updateDoc(projectRef, {
        raisedAmount: currentRaisedAmount + additionalAmount,
        donorsCount: increment(1),
      });
      console.log("Project raised amount and donor count successfully updated.");
    } catch (err) {
      console.error("Error updating project:", err);
      setError((prev) => prev + '\nError updating project: ' + (err as Error).message);
    } finally {
      setProcessingDonation(false);
      setStep('appreciation');
      if (onDonationComplete) {
        onDonationComplete();
      }
    }
  };

  return (
    <div className="overlay-container" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        {/* Donation Step */}
        {step === 'donation' && (
          <div className="step-donation">
            <div className="modal-header">
              <h2>Donate to {projectName}</h2>
              <button className="close-btn" onClick={onClose}>✖</button>
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <div className="input-group">
                <select
                  value={donationData.paymentMethod}
                  onChange={(e) => setDonationData({ ...donationData, paymentMethod: e.target.value })}
                >
                  <option value="wallet">Cryptocurrency Wallet</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Crypto Amount</label>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="0.000000"
                  value={donationData.cryptoAmount}
                  onChange={handleCryptoChange}
                />
                <select
                  value={donationData.cryptoType}
                  onChange={(e) => {
                    const newCryptoType = e.target.value;
                    const rate = getExchangeRate(newCryptoType, donationData.fiatType);
                    setDonationData((prev) => ({
                      ...prev,
                      cryptoType: newCryptoType,
                      fiatAmount: prev.cryptoAmount ? (parseFloat(prev.cryptoAmount) * rate).toFixed(2) : '',
                    }));
                  }}
                >
                  <option value="BNB">BNB</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Fiat Equivalent</label>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="0.00"
                  value={donationData.fiatAmount}
                  onChange={handleFiatChange}
                />
                <select
                  value={donationData.fiatType}
                  onChange={(e) => {
                    const newFiatType = e.target.value;
                    setDonationData((prev) => ({
                      ...prev,
                      fiatType: newFiatType,
                      cryptoAmount: prev.fiatAmount
                        ? (parseFloat(prev.fiatAmount) / getExchangeRate(prev.cryptoType, newFiatType)).toFixed(6)
                        : prev.cryptoAmount,
                    }));
                  }}
                >
                  <option value="MYR">MYR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div className="agreement">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label htmlFor="terms-checkbox">
                By proceeding, you agree to our&nbsp;
                <span className="terms-link">
                  <a href="#" target="_blank" rel="noopener noreferrer">Terms of Use</a>
                </span>&nbsp;and&nbsp;
                <span className="terms-link">
                  <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                </span>.
              </label>
            </div>
            <button className="next-btn" onClick={handleNextStep} disabled={!isChecked}>
              Continue
            </button>
          </div>
        )}

        {/* Info Step */}
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
                defaultValue={userData?.username || ''}
                readOnly={!!userData}
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
                defaultValue={userData?.email || ''}
                readOnly={!!userData}
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
            <button className="next-btn" onClick={handleNextStep}>
              Continue
            </button>
          </div>
        )}

        {/* Wallet / Card Step */}
        {step === 'wallet' && (
          <div className="step-transaction">
            <div className="modal-header">
              <button className="back-btn" onClick={handleBackStep}>←</button>
              <h2>Complete Your Transaction</h2>
              <button className="close-btn" onClick={onClose}>✖</button>
            </div>
            <p>
              Amount: <span>{donationData.cryptoAmount} {donationData.cryptoType}</span>
            </p>
            <p>
              Equivalent to: <span>{donationData.fiatAmount} {donationData.fiatType}</span>
            </p>
            <div className="transaction-details">
              <p>
                <span style={{ fontWeight: 'bold' }}>Payment Method:</span>{' '}
                {donationData.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Crypto Wallet'}
              </p>
              <p>
                <span style={{ fontWeight: 'bold' }}>Donate to:</span> {projectName || 'Unknown Project'}
              </p>
            </div>
            {donationData.paymentMethod === 'card' ? (
              <div className="card-details">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={donationData.cardNumber}
                    onChange={(e) => setDonationData({ ...donationData, cardNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Expiration Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={donationData.cardExpiry}
                    onChange={(e) => setDonationData({ ...donationData, cardExpiry: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={donationData.cardCvc}
                    onChange={(e) => setDonationData({ ...donationData, cardCvc: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={donationData.cardName}
                    onChange={(e) => setDonationData({ ...donationData, cardName: e.target.value })}
                  />
                </div>
                <button className="connect-btn" onClick={handleNextStep}>
                  Continue
                </button>
              </div>
            ) : (
              <>
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
                    <p>
                      Connected: {walletAddress.substring(0, 6)}...
                      {walletAddress.substring(walletAddress.length - 4)}
                    </p>
                  </div>
                ) : (
                  <button className="connect-btn" onClick={connectWallet}>
                    Connect Wallet
                  </button>
                )}
              </>
            )}
            {error && <div className="error-message">{error}</div>}
          </div>
        )}

        {/* Appreciation / Final Step */}
        {step === 'appreciation' && (
          <div className="step-appreciation">
            <div className="modal-header">
              <button className="back-btn" onClick={handleBackStep}>⬅</button>
              <button className="close-btn" onClick={onClose}>✖</button>
            </div>
            <img src="/assets/appreciation.png" alt="Thank You" className="thank-you-logo" />
            <h2 className="thank-you-message">Thank You for Your Kindness!</h2>
            <div className="donation-summary">
              <p>
                Amount: {donationData.cryptoAmount} {donationData.cryptoType}
              </p>
              <p>
                Equivalent: {donationData.fiatAmount} {donationData.fiatType}
              </p>
              <p>
                <span style={{ fontWeight: 'bold' }}>{projectName || 'Unknown Project'}</span>
              </p>
            </div>
            <p className="txid-message">
              {donationData.paymentMethod === 'card'
                ? 'Your card payment is being processed. You will receive an email confirmation within 24 hours.'
                : 'Your donation record will be updated after the TxID is verified.'}
            </p>
            <div className="donation-card">
              <p>{donationData.message || 'No message provided'}</p>
            </div>
            <p className="note">
              *Please note that donations may not be reflected on the website immediately. If your donation is missing, please check back later.
            </p>
    
    {donationData.paymentMethod === 'wallet' && walletAddress && (
      <p className="txid-message">
        Transaction completed from: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
      </p>
    )}
            <button className="done-btn" onClick={handleDonationComplete} disabled={processingDonation}>
              {processingDonation ? 'Processing...' : 'Done'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverlayDonationFlow;
