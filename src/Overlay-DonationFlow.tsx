// OverlayDonationFlow.tsx
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
import { db } from './firebase';
import './Overlay-DonationFlow.css';

// Charity contract ABI
const CHARITY_CONTRACT_ABI = [
  "function donate(string memory _message) public payable",
  "function getDonationCount() public view returns (uint256)",
  "function getDonation(uint256 index) public view returns (address donor, uint256 amount, uint256 timestamp, string memory message)",
  "function getContractBalance() public view returns (uint256)",
  "function getMilestoneCount() public view returns (uint256)",
  "function getMilestone(uint256 index) public view returns (uint256 amount, bool released, string memory description)",
  "function paused() public view returns (bool)",
  "event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp, string message)",
  "event MilestoneReached(uint256 milestoneIndex, uint256 amount)",
  "event ContractPaused(bool paused)"
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
// Note: We added USD rates for crypto conversion.
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
  const [step, setStep] = useState<'donation' | 'info' | 'wallet' | 'appreciation'>('donation');

  // Extend donationData with card fields when paymentMethod is card.
  const [donationData, setDonationData] = useState({
    cryptoAmount: '',
    cryptoType: 'BNB',
    fiatAmount: '',
    fiatType: 'MYR',
    name: '',
    email: '',
    message: '',
    network: 'erc20',
    paymentMethod: 'wallet', // "wallet" for crypto; "card" for card payments
    displayName: false,
    marketingUpdates: false,
    // Card details (for mock credit/debit card)
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

  // Pre-fill user's information from auth context.
  useEffect(() => {
    if (userData) {
      setDonationData((prev) => ({
        ...prev,
        name: userData.username || '',
        email: userData.email,
      }));
    }
  }, [userData]);

  // Helper: get the exchange rate.  const [isContractPaused, setIsContractPaused] = useState(false);
  const [milestones, setMilestones] = useState<Array<{amount: string, released: boolean, description: string}>>([]);

  const getExchangeRate = (crypto: string, fiat: string): number => {
    return exchangeRates[crypto]?.[fiat] || 1;
  };

  // Update fiat equivalent when crypto amount is entered.
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

  // Update crypto equivalent when fiat amount is entered.
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

  // Check if MetaMask is installed.
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined' && window.ethereum?.isMetaMask;
  };

  // Add function to check contract status
  const checkContractStatus = async () => {
    if (!window.ethereum) return;
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const charityContract = new ethers.Contract(CHARITY_CONTRACT_ADDRESS, CHARITY_CONTRACT_ABI, provider);
    
    try {
      const paused = await charityContract.paused();
      setIsContractPaused(paused);
      
      const milestoneCount = await charityContract.getMilestoneCount();
      const milestonePromises = Array.from({length: milestoneCount}, (_, i) => 
        charityContract.getMilestone(i)
      );
      const milestoneResults = await Promise.all(milestonePromises);
      
      setMilestones(milestoneResults.map(([amount, released, description]) => ({
        amount: ethers.utils.formatEther(amount),
        released,
        description
      })));
    } catch (err) {
      console.error('Error checking contract status:', err);
    }
  };

  useEffect(() => {
    checkContractStatus();
  }, []);

  // Process a crypto donation via the smart contract.
  const processDonation = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed');
      return;
    }

    if (isContractPaused) {
      setError('Contract is currently paused. Please try again later.');
      return;
    }
    try {
      setTransactionStatus('pending');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Ensure that the user is on the correct network.
      const network = await provider.getNetwork();
      // 11155111 is Sepolia chain ID; if not on Sepolia, attempt to switch.
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
      const tx = await charityContract.donate(donationData.message || "", {
        value: amountInWei,
        gasLimit: 300000,
      });
      setTransactionHash(tx.hash);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setTransactionStatus('success');
        setStep('appreciation');
        // Refresh contract status after successful donation
        await checkContractStatus();
      } else {
        setTransactionStatus('error');
        setError('Transaction failed');
      }
    } catch (err) {
      setTransactionStatus('error');
      setError(`Transaction failed: ${(err as Error).message}`);
    }
  };

  // Connect the wallet (via MetaMask) and initiate donation.
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install it to continue.');
      return;
    }
    try {
      const accounts = (await window.ethereum?.request({ method: 'eth_requestAccounts' })) as string[];
      if (!accounts?.[0]) throw new Error('No accounts found');
      setWalletAddress(accounts[0]);
      setWalletConnected(true);
      setError('');
      await processDonation();
    } catch (err) {
      setError('Failed to connect wallet: ' + (err as Error).message);
    }
  };

  // Step navigation handlers.
  const handleBackStep = () => {
    if (step === 'info') setStep('donation');
    else if (step === 'wallet') setStep('info');
    else if (step === 'appreciation') setStep('wallet');
  };

  const handleNextStep = () => {
    // In the donation step, ensure terms are agreed.
    if (step === 'donation' && !isChecked) return;
    if (step === 'donation') setStep('info');
    else if (step === 'info') setStep('wallet');
    else if (step === 'wallet') {
      if (donationData.paymentMethod === 'wallet') {
        connectWallet();
      } else {
        // For card payments, simply move on to the appreciation step after a delay.
        // This simulates card processing. In a production environment, integrate with a payment provider.
        setTransactionStatus('pending');
        setTimeout(() => {
          setTransactionStatus('success');
          setStep('appreciation');
        }, 2000);
      }
    }
  };

  // Add donation record and update the project document.
  const handleDonationComplete = async () => {
    if (processingDonation || donationRecorded) return;
    setProcessingDonation(true);

    try {
      // Record the donation.
      await addDoc(collection(db, 'donations'), {
        donor: userData ? (userData.username || userData.email) : 'anonymous',
        message: donationData.message,
        projectId: projectId,
        date: serverTimestamp(),
        paymentMethod: donationData.paymentMethod === 'card' ? 'card' : 'crypto',
        ...(donationData.paymentMethod === 'card'
          ? { fiatAmount: donationData.fiatAmount, fiatCurrency: donationData.fiatType }
          : { cryptoAmount: donationData.cryptoAmount, cryptoType: donationData.cryptoType }
        ),
      });
      setDonationRecorded(true);
    } catch (err) {
      setError('Error adding donation record: ' + (err as Error).message);
    }

    // Calculate the donation amount in USD (the project goal is set in USD)
    let additionalAmountUSD = 0;
    if (donationData.paymentMethod === 'card') {
      const fiatAmount = donationData.fiatAmount ? parseFloat(donationData.fiatAmount) : 0;
      if (donationData.fiatType === 'USD') {
        additionalAmountUSD = fiatAmount;
      } else if (donationData.fiatType === 'MYR') {
        // Conversion: assume 1 USD = 4.7 MYR. Adjust this rate as needed.
        const conversionRateMYRtoUSD = 4.7;
        additionalAmountUSD = fiatAmount / conversionRateMYRtoUSD;
      } else {
        additionalAmountUSD = fiatAmount;
      }
    } else if (donationData.paymentMethod === 'wallet' && donationData.cryptoAmount) {
      const cryptoValue = parseFloat(donationData.cryptoAmount);
      // Always convert the crypto amount to USD, regardless of the chosen fiat display currency.
      additionalAmountUSD = isNaN(cryptoValue)
        ? 0
        : cryptoValue * getExchangeRate(donationData.cryptoType, 'USD');
    }
    if (isNaN(additionalAmountUSD)) {
      additionalAmountUSD = 0;
    }

    // Log the computed value for debugging.
    console.log("Updating project:", projectId, "with additionalAmount in USD:", additionalAmountUSD);

    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        raisedAmount: increment(additionalAmountUSD),
        donorsCount: increment(1),
      });
    } catch (err) {
      setError(prev => prev + '\nError updating project: ' + (err as Error).message);
    } finally {
      setProcessingDonation(false);
      if (onDonationComplete) onDonationComplete();
    }
  };

  // Called when the user clicks "Done".
  const onDone = async () => {
    if (!donationRecorded) {
      await handleDonationComplete();
    } else if (onDonationComplete) {
      onDonationComplete();
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
                By proceeding, you agree to our <a href="#" target="_blank" rel="noopener noreferrer">Terms of Use</a> and <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
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
                defaultValue={userData?.username || ''}
                readOnly={!!userData}
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
        {/*
          Wallet / Card Step:
          If payment method is "card", display card details form.
          Otherwise, display network selection and wallet connection (for crypto wallet).
        */}
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

    {isContractPaused && (
      <div className="warning-message">
        <p>⚠️ Contract is currently paused. Donations are temporarily disabled.</p>
      </div>
    )}

    {milestones.length > 0 && (
      <div className="milestones-section">
        <h3>Milestones</h3>
        <div className="milestones-list">
          {milestones.map((milestone, index) => (
            <div key={index} className={`milestone ${milestone.released ? 'released' : ''}`}>
              <p>{milestone.description}</p>
              <p>Amount: {milestone.amount} ETH</p>
              <p>Status: {milestone.released ? 'Released' : 'Pending'}</p>
            </div>
          ))}
        </div>
      </div>
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
                  <div className="transaction-status success">
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
