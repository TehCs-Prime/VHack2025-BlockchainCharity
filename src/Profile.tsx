import { useState, useEffect, ChangeEvent } from 'react'
import { useAuth } from './AuthContext'
import './Profile.css'
import LocalAvatar from './LocalAvatar'
import { Link } from 'react-router-dom'

interface User {
  username: string
  email: string
  profilePicture: string
  signupDate: string
}

interface Donation {
  id: number
  campaign: string
  amount: string
  currency: string
  date: string
  type: "cash" | "crypto"
}

export default function Profile() {
  const { user, updateUser } = useAuth() as unknown as { user: User; updateUser: (updatedUser: User) => void }
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [newUsername, setNewUsername] = useState<string>(user.username)
  const [previewUrl, setPreviewUrl] = useState<string>(user.profilePicture)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    setNewUsername(user.username)
    setPreviewUrl(user.profilePicture)
  }, [user])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    updateUser({
      ...user,
      username: newUsername,
      profilePicture: previewUrl
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setNewUsername(user.username)
    setPreviewUrl(user.profilePicture)
    setSelectedFile(null)
    setIsEditing(false)
  }

  // Mock donation history
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
    }
  ]

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
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

          <div className="profile-info">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="edit-input"
                />
                
                <div className="edit-buttons">
                  <button 
                    className="save-btn"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2>{user.username}</h2>
                <button 
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>


              
              </>
            )}
            <p>{user.email}</p>
            <p className="signup-date">
              Member since: {new Date(user.signupDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="profile-card">
  <div className="profile-header">
    {/* ... existing profile header content ... */}
  </div>

  {/* Donation History Section */}
  <div className="donation-history">
    <h3>Donation History</h3>
    {donationHistory.map(donation => (
      <div key={donation.id} className="donation-item">
        <div className="donation-main">
          <h4>{donation.campaign}</h4>
          <p className={`donation-amount ${donation.type}`}>
            {donation.amount} {donation.currency}
          </p>
        </div>
        <p className="donation-date">{new Date(donation.date).toLocaleDateString()}</p>
      </div>
    ))}
  </div>

  {/* Account Settings Section */}
  <div className="donation-history">  {/* Changed class name */}
    <h3>Account Settings</h3>
    <div className="donation-item">  {/* Added donation-item wrapper */}
      <div className="donation-main">
        <h4>Account Management</h4>
      <   Link to="/settings" className="settings-btn">
            Manage Account
          </Link>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  )
}
