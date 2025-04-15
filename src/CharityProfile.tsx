// CharityProfile.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import LocalAvatar from './LocalAvatar';
import FundraisingForm from './FundraisingForm';
import CampaignsTable from './CampaignsTable';
import './Profile.css';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export default function CharityProfile() {
  // Retrieve user data and update function from AuthContext.
  const { userData, updateProfile } = useAuth();

  // Only allow charity role users.
  if (!userData || userData.role !== 'charity') {
    return <p>Unauthorized Access</p>;
  }
  const charityUser = userData;

  // Use the charity's verified flag; default is false.
  const isVerified: boolean = charityUser.verified || false;
  const estimatedVerificationTime = '2-3 business days';

  // Control the display of the fundraising proposal form.
  const [showFundraisingForm, setShowFundraisingForm] = useState<boolean>(false);

  // Campaigns state: campaigns created by the charity.
  const [campaigns, setCampaigns] = useState<any[]>([]);
  useEffect(() => {
    if (charityUser && charityUser.uid) {
      const q = query(
        collection(db, 'projects'),
        where('createdBy', '==', charityUser.uid)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const campaignList: any[] = [];
        querySnapshot.forEach((doc) => {
          campaignList.push({ id: doc.id, ...doc.data() });
        });
        setCampaigns(campaignList);
      });
      return unsubscribe;
    }
  }, [charityUser]);

  const handleToggleProposalForm = async () => {
    if (!isVerified) {
      const confirmProposal = window.confirm(
        "Your account is currently unverified. Would you like to submit a proposal? Submitting your proposal will flag your account for verification."
      );
      if (!confirmProposal) return;
      try {
        await updateProfile({ verified: false });
      } catch (err) {
        console.error("Error updating verified status:", err);
      }
    }
    setShowFundraisingForm((prev) => !prev);
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
          {/* Campaign Proposal Section */}
          <section className="section create-campaign">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <h2>Submit Campaign Proposal</h2>
              <button className="save-btn" onClick={handleToggleProposalForm}>
                {showFundraisingForm ? 'Hide Form' : 'Submit Proposal'}
              </button>
            </div>
            {showFundraisingForm && (
              <div className="fundraising-form-container">
                {/* Pass the charity user info to the form */}
                <FundraisingForm charityUser={charityUser} />
              </div>
            )}
          </section>

          {/* Campaigns Table Section */}
          <section className="section campaign-history">
            <h2>Campaigns Created</h2>
            {campaigns.length > 0 ? (
              <CampaignsTable campaigns={campaigns} />
            ) : (
              <p>No campaigns created yet.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
