import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Explore from './Page-Explore';
import ProjectDetails from './Page-ProjectDetails';
import Login from './Login'
import Signup from './Signup'
import Profile from './Profile'
import ImpactReport from './ImpactReport';
import Leaderboard from './Leaderboard';
import './App.css';
import Settings from './Settings';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/explore" element={<Explore />} />
            <Route path="/project/:projectId" element={<ProjectDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/impact" element={<ImpactReport />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            {/* Add other routes as needed */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;