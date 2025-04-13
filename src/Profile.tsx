import { useEffect, useState, ChangeEvent } from 'react';
import { useAuth } from './AuthContext';
import { doc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import './Profile.css';

interface Donation {
  id: string;
  amount: number;
  currency: string;
  date: string;
  campaign: string;
  type: 'cash' | 'crypto';
}

interface UserData {
  uid: string;
  email: string;
  role: 'user' | 'charity';
  username?: string;
  profilePicture?: string;
  createdAt: string;
  organizationName?: string;
  missionStatement?: string;
  registrationNumber?: string;
  documentUrl?: string;
  verified?: boolean;
}

export default function Profile() {
  const { currentUser, userData, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(userData?.username || '');
  const [previewUrl, setPreviewUrl] = useState(userData?.profilePicture || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      if (!currentUser) return;
      
      const donationsRef = collection(db, 'donations');
      const q = query(donationsRef, where('userId', '==', currentUser.uid));
      const snapshot = await getDocs(q);
      setDonations(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Donation));
    };

    fetchDonations();
  }, [currentUser]);

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
      const apiKey = import.meta.env.VITE_IMG_BB_API_KEY;
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

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      const updates: Partial<UserData> = { username: newUsername };

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

      if (currentUser) {
        await updateDoc(doc(db, 'users', currentUser.uid), updates);
        updateProfile(updates);
      }

      setIsEditing(false);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      {error && <div className="error-message">{error}</div>}

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
                src={previewUrl || '/default-avatar.png'}
                alt="Profile"
                className="editable"
              />
              <span className="edit-overlay">✎</span>
            </label>
          ) : (
            <img
              src={userData.profilePicture || '/default-avatar.png'}
              alt="Profile"
              className="static"
            />
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
              <h1>{userData.username}</h1>
              <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </>
          )}
          <p className="email">{userData.email}</p>
          <p className="signup-date">
            Member since: {new Date(userData.createdAt).toLocaleDateString()}
          </p>
        </div>
      </header>

      <main className="profile-content">
        <div className="content-box">
          <section className="section donation-history">
            <h2>Donation History</h2>
            <div className="donation-list">
              {donations.map(donation => (
                <div key={donation.id} className="donation-item">
                  <div className="donation-main">
                    <h3>{donation.campaign}</h3>
                    <p className={`donation-amount ${donation.type}`}>
                      {donation.amount} {donation.currency}
                    </p>
                  </div>
                  <p className="donation-date">
                    {new Date(donation.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}