import { useState, FormEvent } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'user' | 'charity'>('user');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add role-specific authentication logic
    login({
      username: role === 'user' ? 'Ben' : 'Charity Organization',
      email,
      role
    });
    navigate('/');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}