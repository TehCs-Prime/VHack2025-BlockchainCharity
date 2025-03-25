import { useState, useEffect, ChangeEvent } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import './Profile.css';
import LocalAvatar from './LocalAvatar';

interface User {
  username: string;
  email: string;
  profilePicture: string;
  signupDate: string;
}

interface Donation {
  id: number;
  campaign: string;
  amount: string;
  currency: string;
  date: string;
  type: "cash" | "crypto";
}

export default function Profile() {
  const { user, updateUser } = useAuth() as unknown as { user: User; updateUser: (updatedUser: User) => void };
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>(user.username);
  const [previewUrl, setPreviewUrl] = useState<string>(user.profilePicture);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showMore, setShowMore] = useState<boolean>(false);

  useEffect(() => {
    setNewUsername(user.username);
    setPreviewUrl(user.profilePicture);
  }, [user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUser({
      ...user,
      username: newUsername,
      profilePicture: previewUrl
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewUsername(user.username);
    setPreviewUrl(user.profilePicture);
    setSelectedFile(null);
    setIsEditing(false);
  };

  // Extended mock donation history (10 items)
  const donationHistory: Donation[] = [
    {
      id: 1,
      campaign: "Children's Education Fund",
      amount: "100.00",
      currency: "USD",
      date: "2024-03-15",
      type: "cash"
    },
    {
      id: 2,
      campaign: "Climate Action Initiative",
      amount: "0.5",
      currency: "ETH",
      date: "2024-02-28",
      type: "crypto"
    },
    {
      id: 3,
      campaign: "Health for All",
      amount: "50.00",
      currency: "USD",
      date: "2024-01-20",
      type: "cash"
    },
    {
      id: 4,
      campaign: "Clean Water Project",
      amount: "75.00",
      currency: "USD",
      date: "2023-12-10",
      type: "cash"
    },
    {
      id: 5,
      campaign: "Animal Welfare Support",
      amount: "25.00",
      currency: "USD",
      date: "2023-11-05",
      type: "cash"
    },
    {
      id: 6,
      campaign: "Renewable Energy Fund",
      amount: "1.0",
      currency: "BTC",
      date: "2023-10-15",
      type: "crypto"
    },
    {
      id: 7,
      campaign: "Disaster Relief",
      amount: "150.00",
      currency: "USD",
      date: "2023-09-01",
      type: "cash"
    },
    {
      id: 8,
      campaign: "Food Security Initiative",
      amount: "80.00",
      currency: "USD",
      date: "2023-08-20",
      type: "cash"
    },
    {
      id: 9,
      campaign: "Community Empowerment",
      amount: "60.00",
      currency: "USD",
      date: "2023-07-30",
      type: "cash"
    },
    {
      id: 10,
      campaign: "Sustainable Agriculture",
      amount: "90.00",
      currency: "USD",
      date: "2023-06-25",
      type: "cash"
    }
  ];

  // Determine how many donations to display based on showMore state
  const displayedDonations = showMore ? donationHistory.slice(0, 10) : donationHistory.slice(0, 5);

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
              <LocalAvatar 
                user={{ 
                  ...user,
                  profilePicture: previewUrl 
                }}
                className="editable"
              />
              <span className="edit-overlay">✎</span>
            </label>
          ) : (
            <LocalAvatar user={user} className="static" />
          )}
        </div>
        <div className="info-section">
          {isEditing ? (
            <>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="edit-input"
              />
              <div className="edit-buttons">
                <button className="save-btn" onClick={handleSave}>Save</button>
                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h1>{user.username}</h1>
              <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
            </>
          )}
          <p className="email">{user.email}</p>
          <p className="signup-date">Member since: {new Date(user.signupDate).toLocaleDateString()}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="profile-content">
        {/* Content Box with Shadow */}
        <div className="content-box">
          {/* Donation History Section */}
          <section className="section donation-history">
            <h2>Donation History</h2>
            <div className={`donation-list ${showMore ? 'scrollable' : ''}`}>
              {displayedDonations.map(donation => (
                <div key={donation.id} className="donation-item">
                  <div className="donation-main">
                    <h3>{donation.campaign}</h3>
                    <p className={`donation-amount ${donation.type}`}>
                      {donation.amount} {donation.currency}
                    </p>
                  </div>
                  <p className="donation-date">{new Date(donation.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            {!showMore && (
              <button className="view-more-btn" onClick={() => setShowMore(true)}>
                View More
              </button>
            )}
          </section>

          {/* Account Settings Section */}
          <section className="section account-settings">
            <h2>Account Settings</h2>
            <div className="account-item">
              <h3>Manage Your Account</h3>
              <Link 
                to="/settings" 
                className="settings-btn"
                onClick={() => window.scrollTo(0, 0)}
              >
                Go to Settings
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
