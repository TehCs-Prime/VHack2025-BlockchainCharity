/* eslint-disable react-hooks/rules-of-hooks */
// CharityProfile.tsx
import { useState } from 'react';
import { useAuth } from './AuthContext';
import LocalAvatar from './LocalAvatar';
import FundraisingForm from './FundraisingForm';
import './Profile.css';


export default function CharityProfile() {
  const { user } = useAuth();
  if (!user || user.role !== 'charity') {
    return <p>Unauthorized Access</p>;
  }
  const charityUser = user;

  // Automatically set verified if the charity's email is "verifiedcharity@gmail.com"
  const [isVerified] = useState<boolean>(charityUser.email === "verifiedcharity@gmail.com");
  const estimatedVerificationTime = "2-3 business days";
  
  // State for showing the fundraising form
  const [showFundraisingForm, setShowFundraisingForm] = useState<boolean>(false);

  const handleToggleProposalForm = () => {
    if (!isVerified) {
      alert("Your account is currently unverified. Please complete the verification process to create a campaign.");
    } else {
      setShowFundraisingForm(!showFundraisingForm);
    }
  };

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <header className="profile-header">
        <div className="avatar-section">
          <LocalAvatar user={charityUser} className="static" />
        </div>
        <div className="info-section">
          <h1>{charityUser.organizationName || charityUser.username}</h1>
          <p className="email">{charityUser.email}</p>
          <p className="signup-date">
            Member since: {new Date(charityUser.signupDate).toLocaleDateString()}
          </p>
          <div className="charity-status">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p>Status: </p>
            <p style={{ color: isVerified ? 'green' : 'red' }}>
              {isVerified ? "Verified" : "Unverified"}
            </p>
          </div>

          {!isVerified && (
            <p style={{ marginTop: '4px' }}>
              Estimated verification time: {estimatedVerificationTime}
            </p>
          )}
        </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="profile-content">
        <div className="content-box">
          {/* Campaign History Section */}
          <section className="section campaign-history">
            <h2>Campaigns Created</h2>
            
          </section>

          {/* Create Campaign Proposal Section */}
          <section className="section create-campaign">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2>Create Campaign Proposal</h2>
              <button 
                className="save-btn" 
                onClick={handleToggleProposalForm}
              >
                {showFundraisingForm ? "Hide Form" : "Submit Proposal"}
              </button>
            </div>
            
            {showFundraisingForm && (
              <div className="fundraising-form-container">
                <FundraisingForm />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}