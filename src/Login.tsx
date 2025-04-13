import { useState, FormEvent } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { FaArrowLeft } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error: unknown) {
      setError('Failed to log in with Google. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <button 
        onClick={() => navigate('/')} 
        className="back-button"
      >
        <FaArrowLeft /> Back to Home
      </button>
      
      <h2>Login</h2>
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
        
        <div className="forgot-password-link">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        
        <button type="submit" className="login-button">Login</button>
        
        <div className="divider">or</div>
        
        <button 
          type="button" 
          onClick={handleGoogleLogin}
          className="google-login-button"
        >
        <span className="google-logo"></span>
        <span>Continue with Google</span>
        </button>
      </form>
    </div>
  );
}