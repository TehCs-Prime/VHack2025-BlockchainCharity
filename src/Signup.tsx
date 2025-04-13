import { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { FaArrowLeft} from 'react-icons/fa';
import './Signup.css';

export default function Signup() {
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'user' | 'charity'>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // User fields
  const [username, setUsername] = useState('');

  // Charity fields
  const [organizationName, setOrganizationName] = useState('');
  const [missionStatement, setMissionStatement] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (role === 'user') {
        await signup(email, password, 'user', {
          username,
          profilePicture: '',
          createdAt: new Date().toISOString()
        });
        navigate('/');
      } else {
        if (!documentFile) {
          throw new Error('Please upload a document');
        }

        const storageRef = ref(storage, `documents/${Date.now()}_${documentFile.name}`);
        const snapshot = await uploadBytes(storageRef, documentFile);
        const documentUrl = await getDownloadURL(snapshot.ref);

        await signup(email, password, 'charity', {
          organizationName,
          missionStatement,
          registrationNumber,
          documentUrl,
          verified: false,
          profilePicture: '',
          createdAt: new Date().toISOString()
        });

        navigate('/verification-pending');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle(role);
      navigate(role === 'user' ? '/' : '/verification-pending');
    } catch (error: unknown) {
      setError('Failed to sign up with Google. Please try again.');
      console.error(error);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  return (
    <div className="signup-container">
      <button onClick={() => navigate('/')} className="back-button">
        <FaArrowLeft /> Back to Home
      </button>

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

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {role === 'user' ? (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button type="submit" disabled={loading} className="signup-button">
              {loading ? 'Processing...' : 'Sign Up'}
            </button>

            <div className="divider">or</div>

            <button 
              type="button" 
              onClick={handleGoogleSignup}
              className="google-signup-button"
            >
              <span className="google-logo"></span>
              <span>Continue with Google</span>
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Organization Name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />
            <textarea
              placeholder="Mission Statement"
              value={missionStatement}
              onChange={(e) => setMissionStatement(e.target.value)}
              required
              className="mission-statement"
            />
            <input
              type="text"
              placeholder="Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
            />
            <div className="file-upload">
              <label>
                Upload Official Document (PDF)
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required
                />
              </label>
              {documentFile && <span className="file-name">{documentFile.name}</span>}
            </div>
            <button type="submit" disabled={loading} className="signup-button">
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </>
        )}
      </form>

      {role === 'user' && (
        <div className="login-redirect">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      )}
    </div>
  );
}