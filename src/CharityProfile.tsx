import React, { useState, useEffect, ChangeEvent } from 'react';
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

  // Editing state for the charity profile information.
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(
    charityUser.organizationName || charityUser.username || ''
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(
    charityUser.profilePicture || '/default-avatar.png'
  );
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadToImgBB = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiKey = 'ea041d81863434cecbdb34bfe3264458';
      if (!apiKey) throw new Error('Missing ImgBB API key');

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Image upload failed');
      }

      return data.data.url;
    } catch (err) {
      console.error('ImgBB upload error:', err);
      throw new Error(
        err instanceof Error ? err.message : 'Failed to upload image'
      );
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates: any = { organizationName: newName };

      if (selectedFile) {
        if (!selectedFile.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
          throw new Error('File size must be less than 5MB');
        }
        const imageUrl = await uploadToImgBB(selectedFile);
        updates.profilePicture = imageUrl;
      }

      // Update profile info.
      await updateProfile(updates);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

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

  // (existing campaigns useEffect remains unchanged)
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

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <header className="profile-header">
        <div className="avatar-section">
          {isEditing ? (
            <label className="profile-pic-edit">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <img
                src={previewUrl}
                alt="Profile"
                className="editable"
              />
              <span className="edit-overlay">✎</span>
            </label>
          ) : (
            <LocalAvatar user={charityUser} className="static" />
          )}
        </div>
        <div className="info-section">
          {isEditing ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="edit-input"
              />
              <div className="edit-buttons">
                <button className="save-btn" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>{charityUser.organizationName || charityUser.username}</h1>
              <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </>
          )}
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