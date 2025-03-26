// Signup.tsx
import { useState, FormEvent } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup: React.FC = () => {
  const [role, setRole] = useState<'user' | 'charity'>('user');
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [charityData, setCharityData] = useState({
    organizationName: '',
    missionStatement: '',
    registrationNumber: '',
    website: '',
    address: ''
  });
  // State for storing the PDF document (only for charity)
  const [pdfDocument, setPdfDocument] = useState<File | null>(null);
  // State to control display of the verification card modal
  const [showVerificationCard, setShowVerificationCard] = useState<boolean>(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfDocument(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // For charity, simulate a check of the registration number against a database.
    // In this example, registrationNumber "123" is not in the database.
    if (role === 'charity' && charityData.registrationNumber === "123") {
      alert("The registration number is not found in the government database.");
      return;
    }
    
    // Handle registration based on role
    const user = role === 'user'
      ? {
          username: userData.username,
          email: userData.email,
          role
        }
      : {
          username: charityData.organizationName,
          email: userData.email,
          role,
          ...charityData,
          // Attach the pdf document if available
          document: pdfDocument
        };

    login(user);
    
    if (role === 'charity') {
      // Instead of a system alert, show a custom verification card modal.
      setShowVerificationCard(true);
    } else {
      navigate('/');
    }
  };

  // OK button: Accept the verification message and navigate to home.
  const handleCardClose = () => {
    setShowVerificationCard(false);
    navigate('/');
  };

  // Cancel button: Cancel the sign-up process for charity.
  const handleCardCancel = () => {
    setShowVerificationCard(false);
    logout();
    navigate('/signup');
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <div className="role-switcher">
        <button
          type="button"
          className={role === 'user' ? 'active' : ''}
          onClick={() => setRole('user')}
        >
          User
        </button>
        <button
          type="button"
          className={role === 'charity' ? 'active' : ''}
          onClick={() => setRole('charity')}
        >
          Charity
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {role === 'user' ? (
          <>
            <input
              type="text"
              placeholder="Username"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              required
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Organization Name"
              value={charityData.organizationName}
              onChange={(e) => setCharityData({ ...charityData, organizationName: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Organization Email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              required
            />
            <textarea
              placeholder="Mission Statement"
              value={charityData.missionStatement}
              onChange={(e) => setCharityData({ ...charityData, missionStatement: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Registration Number"
              value={charityData.registrationNumber}
              onChange={(e) => setCharityData({ ...charityData, registrationNumber: e.target.value })}
              required
            />
            {/* New PDF document upload field */}
            <div className="pdf-upload">
              <label htmlFor="pdfDocument" className="custom-file-label">
                Upload Document (PDF)
              </label>
              <input
                id="pdfDocument"
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                required
                style={{ display: 'none' }}
              />
              {/* Display the file name if a PDF is selected */}
              {pdfDocument && <p className="uploaded-file-name">{pdfDocument.name}</p>}
            </div>
          </>
        )}
        <button type="submit">Sign Up as {role}</button>
      </form>

      {/* Verification Card Modal for charity sign-ups */}
      {showVerificationCard && (
        <div className="verification-card">
          <div className="card-content">
            <h3>Verification in Process</h3>
            <p>
              Your organization's information has been sent to The Global KYC Leader - Jumio for verification.
              This process might take 2-3 business days.
            </p>
            <div className="card-buttons">
              <button className="card-btn" onClick={handleCardClose}>OK</button>
              <button className="card-btn cancel" onClick={handleCardCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
