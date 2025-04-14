// components/CharityProfile.tsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import LocalAvatar from './LocalAvatar';
import FundraisingForm from './FundraisingForm';
import './Profile.css';

export default function CharityProfile() {
  // Retrieve userData and updateProfile from the AuthContext.
  const { userData, updateProfile } = useAuth();

  // Check that userData exists and that the role is charity.
  if (!userData || userData.role !== 'charity') {
    return <p>Unauthorized Access</p>;
  }
  const charityUser = userData;

  // Read the verified status from firebase; default to false if undefined.
  const isVerified: boolean = charityUser.verified || false;
  const estimatedVerificationTime = '2-3 business days';

  // State to control display of the fundraising proposal form.
  const [showFundraisingForm, setShowFundraisingForm] = useState<boolean>(false);

  // Function to handle toggling the proposal form.
  // If the account is unverified, we prompt and then update the status in Firebase.
  const handleToggleProposalForm = async () => {
    if (!isVerified) {
      const confirmProposal = window.confirm(
        "Your account is currently unverified. Would you like to submit a proposal and have your account marked as verified?"
      );
      if (confirmProposal) {
        try {
          // Update the user's profile in Firebase to mark them as verified.
          await updateProfile({ verified: false });
          // You may also want to provide feedback (e.g., a toast or message) that the update was successful.
          setShowFundraisingForm(false);
        } catch (err) {
          console.error("Error updating verified status:", err);
        }
      }
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
            Member since: {new Date(charityUser.createdAt).toLocaleDateString()}
          </p>
          <div className="charity-status">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p>Status: </p>
              <p style={{ color: isVerified ? 'green' : 'red' }}>
                {isVerified ? 'Verified' : 'Unverified'}
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
            {/* You can map over campaign data here */}
          </section>

          {/* Create Campaign Proposal Section */}
          <section className="section create-campaign">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <h2>Create Campaign Proposal</h2>
              <button className="save-btn" onClick={handleToggleProposalForm}>
                {showFundraisingForm ? 'Hide Form' : 'Submit Proposal'}
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
