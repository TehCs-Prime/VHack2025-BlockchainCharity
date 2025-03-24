import { useState } from 'react';
import './Achievement.css';

interface Achievement {
  id: number;
  title: string;
  progress: number;
  criteria: string;
  achieved: boolean;
  icon: string;
}

export function AchievementDashboard() {
  const [showAll, setShowAll] = useState<boolean>(false);
  const [viewCompleted, setViewCompleted] = useState<boolean>(true);

  const achievements: Achievement[] = [
    { id: 1, title: "First-Time Donor", progress: 100, criteria: "Make your first donation", achieved: true, icon: "fa-heart" },
    { id: 2, title: "Monthly Contributor", progress: 60, criteria: "Donate for 6 consecutive months", achieved: false, icon: "fa-trophy" },
    { id: 3, title: "Top Fundraiser", progress: 30, criteria: "Raise $500 for charity", achieved: false, icon: "fa-star" },
    { id: 4, title: "Active Supporter", progress: 80, criteria: "Participate in 10 charity events", achieved: false, icon: "fa-users" },
    { id: 5, title: "Generous Donor", progress: 50, criteria: "Donate over $1000", achieved: false, icon: "fa-gift" },
  ];

  const completedAchievements: Achievement[] = achievements.filter((ach) => ach.progress === 100);
  const inProgressAchievements: Achievement[] = achievements.filter((ach) => ach.progress < 100).sort((a, b) => b.progress - a.progress);

  return (
    <div className="achievement-container">
      <h1 className="achievement-title">My Achievements</h1>
      <div className="achievement-grid">
        {achievements.slice(0, 4).map((ach) => (
          <div key={ach.id} className="achievement-card">
            <div className="achievement-card-header">
              <div className="achievement-avatar">
                <i className={`fas ${ach.icon} achievement-icon`}></i>
              </div>
              <div className="achievement-info">
                <h2 className="achievement-card-title">{ach.title}</h2>
                <p className="achievement-card-criteria">{ach.criteria}</p>
                <div className="achievement-progress-container">
                  <div
                    className={`achievement-progress-bar ${ach.progress === 100 ? 'complete' : 'incomplete'}`}
                    style={{ width: `${ach.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="achievement-viewmore-container">
        <button className="achievement-viewmore-btn" onClick={() => setShowAll(true)}>
          View More
        </button>
      </div>

      {showAll && (
        <div className="achievement-modal">
          <div className="achievement-modal-inner">
            <h2 className="achievement-modal-title">Achievements</h2>
            <div className="achievement-modal-btn-group">
              <button
                className={`achievement-modal-button ${viewCompleted ? 'active' : ''}`}
                onClick={() => setViewCompleted(true)}
              >
                Completed
              </button>
              <button
                className={`achievement-modal-button ${!viewCompleted ? 'active' : ''}`}
                onClick={() => setViewCompleted(false)}
              >
                In Progress
              </button>
            </div>
            <button
              className="achievement-modal-close"
              onClick={() => {
                setShowAll(false);
                setViewCompleted(true);
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="achievement-modal-content">
              <div className="achievement-modal-list">
                {(viewCompleted ? completedAchievements : inProgressAchievements).map((ach) => (
                  <div key={ach.id} className="achievement-card">
                    <div className="achievement-card-header">
                      <div className="achievement-avatar">
                        <i className={`fas ${ach.icon} achievement-icon`}></i>
                      </div>
                      <div className="achievement-info">
                        <h2 className="achievement-card-title">{ach.title}</h2>
                        <p className="achievement-card-criteria">{ach.criteria}</p>
                        <p className="achievement-progress-percent">{ach.progress}%</p>
                        <div className="achievement-progress-container">
                          <div
                            className={`achievement-progress-bar ${ach.progress === 100 ? 'complete' : 'incomplete'}`}
                            style={{ width: `${ach.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
