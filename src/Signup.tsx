import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import CharitySignup from './CharitySignup';
import { FaArrowLeft} from 'react-icons/fa';

import './Signup.css';

const Signup: React.FC = () => {
  // 'user' (default) or 'charity' role
  const [role, setRole] = useState<'user' | 'charity'>('user');

  // State for regular user signup
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // For regular users, we'll use signup (not login) to create a new account.
  const { signup , signInWithGoogle} = useAuth();
  const navigate = useNavigate();

  // Submit for regular user signup
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Use the signup function to create the account.
      await signup(userData.email, userData.password, 'user', {
        username: userData.username
      });
      // Optionally, if you want to automatically sign in after signup, you can do so.
      navigate('/');
    } catch (err) {
      console.error('Error signing up:', err);
    }
  };

  // For charity signups, once the charity account is registered the backend
  // will manage verification status; on success, we navigate to the homepage.
  const handleCharitySuccess = async () => {
    navigate('/');
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

  return (
    <div className="signup-container">
      <button onClick={() => navigate('/')} className="return-button">
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

      {role === 'user' ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            required
          />
          <button type="submit" className = "signup-button">Sign Up</button>
          <div className="divider">or</div>

<button 
  type="button" 
  onClick={handleGoogleSignup}
  className="google-signup-button"
>
  <span className="google-logo"></span>
  <span>Continue with Google</span>
</button>
          <div className="login-redirect">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
        </form>
      ) : (
        <CharitySignup onSuccess={handleCharitySuccess} />
      )}
    </div>
  );
};

export default Signup;
