import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ethers } from 'ethers';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { db } from './firebase';
import './Overlay-DonationFlow.css';

// Charity contract ABI
const CHARITY_CONTRACT_ABI = [
  "function donate(string memory _message) public payable",
  "function getDonationCount() public view returns (uint256)",
  "function getDonation(uint256 index) public view returns (address donor, uint256 amount, uint256 timestamp, string memory message)",
  "function getContractBalance() public view returns (uint256)",
  "event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp, string message)"
];

// Replace with your deployed contract address
const CHARITY_CONTRACT_ADDRESS = "0xd415ceA038D7829935a9c986e14E348e3b24c3A7";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<unknown>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}

interface OverlayDonationFlowProps {
  onClose: () => void;
  projectName?: string;
  projectId: string; // Firestore document ID of the project
  onDonationComplete?: () => void; // Callback to refresh project details
  currentRaisedAmount?: number;
}

// Exchange rates for converting crypto to fiat.
const exchangeRates: { [key: string]: { [key: string]: number } } = {
  BNB: { MYR: 1500, USD: 320 },
  BTC: { MYR: 250000, USD: 55000 },
  ETH: { MYR: 17000, USD: 3800 },
};

const OverlayDonationFlow: React.FC<OverlayDonationFlowProps> = ({
  onClose,
  projectName,
  projectId,
  onDonationComplete,
  currentRaisedAmount,
}) => {
  const { userData } = useAuth();
  const fbAuth = getAuth(); // Firebase Auth instance for anonymous sign-in
  const [step, setStep] = useState<'donation' | 'info' | 'wallet' | 'appreciation'>('donation');

  const [donationData, setDonationData] = useState({
    cryptoAmount: '',
    cryptoType: 'BNB',
    fiatAmount: '',
    fiatType: 'MYR',
    /** Controlled name/email now */
    name: '',
    email: '',
    message: '',
    network: 'erc20',
    paymentMethod: 'wallet',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  });

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [processingDonation, setProcessingDonation] = useState(false);
  const [donationRecorded, setDonationRecorded] = useState(false);

  // Pre-fill user's information if logged in
  useEffect(() => {
    if (userData) {
      setDonationData((prev) => ({
        ...prev,
        name: userData.username || '',
        email: userData.email || '',
      }));
    }
  }, [userData]);

  const getExchangeRate = (crypto: string, fiat: string): number =>
    exchangeRates[crypto]?.[fiat] || 1;

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

  const isMetaMaskInstalled = () =>
    typeof window.ethereum !== 'undefined' && window.ethereum?.isMetaMask;

  const processDonation = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed');
      return;
    }
    try {
      setTransactionStatus('pending');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const network = await provider.getNetwork();
      if (network.chainId !== 11155111) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      }

      const charityContract = new ethers.Contract(
        CHARITY_CONTRACT_ADDRESS,
        CHARITY_CONTRACT_ABI,
        signer
      );
      const amountInWei = ethers.utils.parseEther(donationData.cryptoAmount);
      const tx = await charityContract.donate(donationData.message || '', {
        value: amountInWei,
        gasLimit: 300000,
      });
      setTransactionHash(tx.hash);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setTransactionStatus('success');
        setStep('appreciation');
      } else {
        setTransactionStatus('error');
        setError('Transaction failed');
      }
    } catch (err: any) {
      setTransactionStatus('error');
      setError(`Transaction failed: ${err.message}`);
    }
  };

  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install it to continue.');
      return;
    }
    try {
      const accounts = (await window.ethereum!.request({ method: 'eth_requestAccounts' })) as string[];
      if (!accounts[0]) throw new Error('No accounts found');
      setWalletAddress(accounts[0]);
      setWalletConnected(true);
      setError('');
      await processDonation();
    } catch (err: any) {
      setError('Failed to connect wallet: ' + err.message);
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
    else if (step === 'wallet') {
      if (donationData.paymentMethod === 'wallet') connectWallet();
      else {
        setTransactionStatus('pending');
        setTimeout(() => {
          setTransactionStatus('success');
          setStep('appreciation');
        }, 2000);
      }
    }
  };

  const handleDonationComplete = async () => {
    if (processingDonation || donationRecorded) return;
    setProcessingDonation(true);

    // Sign in anonymously if user not logged in
    if (!userData) {
      try {
        await signInAnonymously(fbAuth);
      } catch (authErr) {
        console.error('Anonymous auth failed', authErr);
      }
    }

    const donorName = donationData.name.trim() || 'anonymous';

    // Modified donationRecord to include the campaign name using projectName
    const donationRecord: any = {
      donor: donorName,
      campaign: projectName || 'Unknown Campaign',
      message: donationData.message,
      projectId,
      userId: userData?.uid || 'anonymous',
      date: serverTimestamp(),
      paymentMethod: donationData.paymentMethod === 'card' ? 'card' : 'crypto',
      ...(donationData.paymentMethod === 'card'
        ? { fiatAmount: donationData.fiatAmount, fiatCurrency: donationData.fiatType }
        : { cryptoAmount: donationData.cryptoAmount, cryptoType: donationData.cryptoType }),
    };

    if (donationData.paymentMethod === 'wallet' && transactionHash) {
      donationRecord.etherscanLink = `https://sepolia.etherscan.io/tx/${transactionHash}`;
    }

    try {
      await addDoc(collection(db, 'donations'), donationRecord);
      setDonationRecorded(true);
    } catch (err: any) {
      setError('Error adding donation record: ' + err.message);
    }

    // keep your existing project update logic…
    let additionalAmountUSD = 0;
    if (donationData.paymentMethod === 'card') {
      const fiatAmount = parseFloat(donationData.fiatAmount) || 0;
      additionalAmountUSD =
        donationData.fiatType === 'MYR' ? fiatAmount / 4.7 : fiatAmount;
    } else {
      const cv = parseFloat(donationData.cryptoAmount) || 0;
      additionalAmountUSD = cv * getExchangeRate(donationData.cryptoType, 'USD');
    }

    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        raisedAmount: increment(additionalAmountUSD),
        donorsCount: increment(1),
      });
    } catch (err: any) {
      setError(prev => prev + '\nError updating project: ' + err.message);
    } finally {
      setProcessingDonation(false);
      onDonationComplete?.();
    }
  };

  const onDone = async () => {
    if (!donationRecorded) {
      await handleDonationComplete();
    } else {
      onDonationComplete?.();
    }
    onClose();
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
              <label>Payment Method</label>
              <div className="input-group">
                <select
                  value={donationData.paymentMethod}
                  onChange={(e) =>
                    setDonationData({ ...donationData, paymentMethod: e.target.value })
                  }
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
                By proceeding, you agree to our{" "}
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Terms of Use
                </a>{" "}
                and{" "}
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>.
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
                value={donationData.name}
                onChange={(e) => setDonationData({ ...donationData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                defaultValue={userData?.email || ''}
                readOnly={!!userData}
              />
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
        {step === 'appreciation' && (
          <div className="step-appreciation">
            <div className="modal-header">
              <button className="back-btn" onClick={handleBackStep}>⬅</button>
              <button className="close-btn" onClick={onClose}>✖</button>
            </div>
            <img src="/assets/appreciation.png" alt="Thank You" className="thank-you-logo" />
            <h2 className="thank-you-message">Thank You for Your Kindness!</h2>
            <div className="donation-summary">
              <p>Amount: {donationData.cryptoAmount} {donationData.cryptoType}</p>
              <p>Equivalent: {donationData.fiatAmount} {donationData.fiatType}</p>
              <p><span style={{ fontWeight: 'bold' }}>{projectName || "Unknown Project"}</span></p>
            </div>
            <p className="txid-message">
              {donationData.paymentMethod === 'card'
                ? "Your card payment is being processed. You'll receive email confirmation within 24 hours."
                : "Your donation records will be shown on the website after the TxID is verified."}
            </p>
            <div className="donation-card">
              <p>{donationData.message || 'No message provided'}</p>
            </div>
            <p className="note">
              *Please note donations may not be reflected on the website or calculated in the total amount immediately. If your donation is missing, check back later.
            </p>
            {donationData.paymentMethod === 'wallet' && (
              <>
                {transactionStatus === 'pending' && (
                  <div className="transaction-status pending">
                    <p>Processing your donation...</p>
                    <p>Transaction Hash: {transactionHash}</p>
                  </div>
                )}
                {transactionStatus === 'success' && (
                  <div className="transaction-status success break-words">
                    <p>Donation successful!</p>
                    <p>Transaction Hash: {transactionHash}</p>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Etherscan
                    </a>
                  </div>
                )}
              </>
            )}
            {transactionStatus === 'error' && (
              <div className="transaction-status error">
                <p>Transaction failed. Please try again.</p>
                <p>{error}</p>
              </div>
            )}
            <button className="done-btn" onClick={onDone}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverlayDonationFlow;
