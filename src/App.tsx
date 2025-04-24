import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Explore from './Page-Explore';
import ProjectDetails from './Page-ProjectDetails';
import Login from './Login';
import Signup from './Signup';
import ImpactReport from './ImpactReport';
import Leaderboard from './Leaderboard';
import Settings from './Settings';
import ProfilePage from './ProfilePage';  // New combined profile page
import Home from './Home';
import Approach from './Page-Approach'
import './App.css';
import CharityProfile from './CharityProfile';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/project/:projectId" element={<ProjectDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/charity-profile" element={<CharityProfile />} />
            <Route path="/impact" element={<ImpactReport />} />
            <Route path="/approach" element={<Approach />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
