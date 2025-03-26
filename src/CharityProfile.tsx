// CharityProfile.tsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import LocalAvatar from './LocalAvatar';
import './Profile.css';

interface Campaign {
  id: number;
  title: string;
  goal: string;
  raised: string;
  deadline: string;
}

export default function CharityProfile() {
  const { user } = useAuth();
  if (!user || user.role !== 'charity') {
    return <p>Unauthorized Access</p>;
  }
  const charityUser = user;

  // Automatically set verified if the charity's email is "verifiedcharity@gmail.com"
  const [isVerified, setIsVerified] = useState<boolean>(charityUser.email === "verifiedcharity@gmail.com");
  const estimatedVerificationTime = "2-3 business days";

  // Campaign history with 10 items (only used if verified)
  const campaignHistory: Campaign[] = [
    { id: 1, title: "Help Build a New Shelter", goal: "5000.00", raised: "2500.00", deadline: "2024-04-30" },
    { id: 2, title: "Food Drive for the Community", goal: "3000.00", raised: "3000.00", deadline: "2024-03-15" },
    { id: 3, title: "Medical Aid for Remote Areas", goal: "8000.00", raised: "4000.00", deadline: "2024-05-20" },
    { id: 4, title: "Clean Water for Villages", goal: "6000.00", raised: "3500.00", deadline: "2024-06-10" },
    { id: 5, title: "Renewable Energy Project", goal: "10000.00", raised: "5000.00", deadline: "2024-07-05" },
    { id: 6, title: "Education for Underprivileged", goal: "7000.00", raised: "3000.00", deadline: "2024-08-15" },
    { id: 7, title: "Emergency Relief Fund", goal: "4000.00", raised: "2500.00", deadline: "2024-09-01" },
    { id: 8, title: "Healthcare Camps", goal: "5000.00", raised: "1500.00", deadline: "2024-10-20" },
    { id: 9, title: "Community Center", goal: "9000.00", raised: "4500.00", deadline: "2024-11-30" },
    { id: 10, title: "Green Spaces Initiative", goal: "8000.00", raised: "6000.00", deadline: "2024-12-15" }
  ];

  // State to toggle showing more campaigns (only if verified)
  const [showMoreCampaigns, setShowMoreCampaigns] = useState<boolean>(false);
  const displayedCampaigns = showMoreCampaigns ? campaignHistory : campaignHistory.slice(0, 5);

  // Proposal form state
  const [showProposalForm, setShowProposalForm] = useState<boolean>(false);
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [proposalPreview, setProposalPreview] = useState<string | null>(null);

  const handleProposalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProposalFile(file);
      setProposalPreview(file.name);
    }
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Proposal submitted successfully!");
    setProposalFile(null);
    setProposalPreview(null);
    setShowProposalForm(false);
  };

  const handleToggleProposalForm = () => {
    if (!isVerified) {
      alert("Your account is currently unverified. Please complete the verification process to create a campaign.");
    } else {
      setShowProposalForm((prev) => !prev);
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
            <p>Status: {isVerified ? "Verified" : "Unverified"}</p>
            {!isVerified && (
              <p>Estimated verification time: {estimatedVerificationTime}</p>
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
            {isVerified ? (
              <>
                <div className={`donation-list ${showMoreCampaigns ? 'scrollable' : ''}`}>
                  {displayedCampaigns.map(campaign => (
                    <div key={campaign.id} className="donation-item">
                      <div className="donation-main">
                        <h3>{campaign.title}</h3>
                        <p className="donation-amount">
                          Goal: {campaign.goal} / Raised: {campaign.raised}
                        </p>
                      </div>
                      <p className="donation-date">
                        Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
                {!showMoreCampaigns && (
                  <button className="view-more-btn" onClick={() => setShowMoreCampaigns(true)}>
                    View More
                  </button>
                )}
              </>
            ) : (
              <p style={{ fontStyle: 'italic', marginTop: '1rem' }}>
                No campaigns have been created yet. Once your account is verified, you can start launching impactful campaigns.
              </p>
            )}
          </section>

          {/* Create Campaign Proposal Section */}
          <section className="section create-campaign" style={{ display: 'flex', alignItems: 'flex-start' }}>
            <h2>Create Campaign Proposal</h2>
            <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <button className="save-btn" onClick={handleToggleProposalForm}>
                {showProposalForm ? "Hide Proposal Form" : "Submit Proposal"}
              </button>
              {showProposalForm && (
                <form onSubmit={handleProposalSubmit} style={{ marginTop: '1rem' }}>
                  {/* Custom file input */}
                  <label 
                    htmlFor="proposalInput"
                    style={{ border: '1px solid #f39c12', padding: '0.5rem', cursor: 'pointer' }}
                  >
                    Choose File
                  </label>
                  <input
                    id="proposalInput"
                    type="file"
                    accept="application/pdf"
                    onChange={handleProposalChange}
                    required
                    style={{ display: 'none' }}
                  />
                  {proposalPreview && <p>Uploaded file: {proposalPreview}</p>}
                  <button type="submit" className="save-btn" style={{ marginTop: '0.5rem' }}>
                    Submit
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
