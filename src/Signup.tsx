// Signup.tsx
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import CharitySignup from './CharitySignup';
import './Signup.css';

const Signup: React.FC = () => {
  const [role, setRole] = useState<'user' | 'charity'>('user');
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (role === 'user') {
      const user = {
        username: userData.username,
        email: userData.email,
        role
      };
      login(user);
      navigate('/');
    }
  };

  const handleCharitySuccess = () => {
    login({
      username: 'Charity Organization',
      email: userData.email,
      role: 'charity'
    });
    navigate('/');
  };

  return (
    <div className="signup-container">
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
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      ) : (
        <CharitySignup onSuccess={handleCharitySuccess} />
      )}
    </div>
  );
};

export default Signup;
