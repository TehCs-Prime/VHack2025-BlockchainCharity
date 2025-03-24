import React from 'react';
import Profile from './Profile';
import { AchievementDashboard } from './Achievement';
import { BadgeShowcase } from './Badge';
import './Profile.css'; // Optional: add your own styles

const ProfilePage: React.FC = () => {
  return (
    <div className="profile-page">
      <Profile /> 
        <AchievementDashboard />
        <BadgeShowcase />
    </div>
  );
};

export default ProfilePage;
