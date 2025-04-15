import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Explore from './Page-Explore';
import ProjectDetails from './Page-ProjectDetails';
import Login from './Login';
import Signup from './Signup';
import ImpactReport from './ImpactReport';
import Leaderboard from './Leaderboard';
import Settings from './Settings';
import ProfilePage from './ProfilePage';
import Home from './Home';
import Approach from './Page-Approach';
import CharityProfile from './CharityProfile';
import './App.css';
import CharitySignup from './CharitySignup';

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app">
      {!hideHeaderFooter && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/project/:projectId" element={<ProjectDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/charity-signup" element={<CharitySignup onSuccess={() => { /* redirect or notify */ }} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/charity-profile" element={<CharityProfile />} />
          <Route path="/project/:id" element={<ProjectDetails/>} />
          <Route path="/impact" element={<ImpactReport />} />
          <Route path="/approach" element={<Approach />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;
