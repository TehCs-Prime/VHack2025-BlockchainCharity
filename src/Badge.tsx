import { useState } from 'react';
import './Badge.css';

interface Badge {
  id: number;
  title: string;
  icon: string;
}

const badges: Badge[] = [
  { id: 1, title: "First-Time Donor", icon: "fa-heart" },
  { id: 2, title: "Top Fundraiser", icon: "fa-star" },
  { id: 3, title: "Generous Donor", icon: "fa-gift" },
  { id: 4, title: "Philantrophy Champion", icon: "fa-users" },
];

export function BadgeShowcase() {
  const [selectedBadges, setSelectedBadges] = useState<Badge[]>([badges[0]]);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const toggleBadgeSelection = (badge: Badge): void => {
    const isSelected = selectedBadges.some((b) => b.id === badge.id);
    if (isSelected) {
      setSelectedBadges(selectedBadges.filter((b) => b.id !== badge.id));
    } else if (selectedBadges.length < 3) {
      setSelectedBadges([...selectedBadges, badge]);
    }
  };

  return (
    <div className="badge-container !pt-10 !pb-4">
      <div className="badge-header">
        <h1 className="badge-title">My Badges</h1>
        <button
          className="badge-edit-btn"
          onClick={() => setShowMenu(true)}
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
      </div>

      <div className="badge-grid">
        {selectedBadges.map((badge) => (
          <div key={badge.id} className="badge-card">
            <div className="badge-avatar">
              <i className={`fas ${badge.icon} badge-icon`}></i>
            </div>
            <p className="badge-title-text">{badge.title}</p>
          </div>
        ))}
        {selectedBadges.length === 0 && (
          <p className="badge-none-text">No badges selected.</p>
        )}
      </div>

      {showMenu && (
        <div className="badge-modal">
          <div className="badge-modal-inner">
            <h2 className="badge-modal-title">Select Up to 3 Badges</h2>
            <div className="badge-modal-grid">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`badge-option ${selectedBadges.some((b) => b.id === badge.id) ? 'badge-selected' : ''}`}
                  onClick={() => toggleBadgeSelection(badge)}
                >
                  <div className="badge-option-avatar">
                    <i className={`fas ${badge.icon} badge-icon`}></i>
                  </div>
                  <span className="badge-option-text">{badge.title}</span>
                </div>
              ))}
            </div>
            <div className="badge-modal-close-container">
              <button
                className="badge-modal-close"
                onClick={() => setShowMenu(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
