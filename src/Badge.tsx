import { useState } from "react";

interface Badge {
  id: number;
  title: string;
  icon: string;
}

const badges: Badge[] = [
  { id: 1, title: "First-Time Donor", icon: "fa-heart text-red-600" },
  { id: 2, title: "Top Fundraiser", icon: "fa-star text-yellow-300" },
  { id: 3, title: "Generous Donor", icon: "fa-gift text-green-500" },
  { id: 4, title: "Active Supporter", icon: "fa-users text-purple-600" },
];

export default function BadgeShowcase() {
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
    <div className="bg-gray-100 px-10 py-12 text-center relative">
      <div className="flex justify-center items-center gap-4 mb-6">
        <h1 className="text-4xl font-semibold text-gray-800">My Badges</h1>
        <button
          className="cursor-pointer h-8 w-8 flex justify-center items-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          onClick={() => setShowMenu(true)}
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
      </div>

      <div className="relative w-full py-4 px-10 flex justify-center space-x-4 overflow-hidden">
        {selectedBadges.map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center justify-center space-y-2 bg-white w-[200px] h-[250px] rounded-lg shadow-md select-none p-4"
          >
            <div className="bg-gray-200 h-20 w-20 rounded-full text-3xl flex justify-center items-center">
              <i className={`fas ${badge.icon}`}></i>
            </div>
            <p className="text-center text-lg font-semibold mt-5">{badge.title}</p>
          </div>
        ))}
        {selectedBadges.length === 0 && (
          <p className="text-gray-500 text-lg">No badges selected.</p>
        )}
      </div>

      {showMenu && (
        <div className="absolute h-screen inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center p-6">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Select Up to 3 Badges
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`cursor-pointer p-4 rounded-lg flex items-center gap-3 shadow-md transition ${
                    selectedBadges.some((b) => b.id === badge.id)
                      ? "bg-blue-200 border-blue-500 border-2"
                      : "bg-gray-100"
                  }`}
                  onClick={() => toggleBadgeSelection(badge)}
                >
                  <div className="bg-gray-200 h-10 w-10 rounded-full flex justify-center items-center">
                    <i className={`fas ${badge.icon}`}></i>
                  </div>
                  <span className="text-gray-700 font-semibold">{badge.title}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
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
