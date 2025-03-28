import { useState } from "react";
import "./Leaderboard.css";

// Define LeaderboardEntry with proper properties
interface LeaderboardEntry {
  id: number;
  name: string;
  totalDonations?: number;
  singleDonation?: number;
  donationCount?: number;
  topSupportedProject?: string;
  supportedProject?: string;
  avgDonationSize?: number;
  badgeTitle?: string;
  amount?: number;
  img?: string;
}

// Define LeaderboardData structure
interface LeaderboardData {
  [key: string]: {
    allTime: LeaderboardEntry[];
    monthly: LeaderboardEntry[];
  };
}

// Leaderboard Data
const leaderboardData: LeaderboardData = {
  TopContributors: {
    allTime: [
      { id: 1, name: "Ben", totalDonations: 10000, topSupportedProject: "Clean Water Initiative", img: "./assets/dummy-male.png", badgeTitle: "Philanthropy Champion" },
      { id: 2, name: "Bob Smith", totalDonations: 9500, topSupportedProject: "Education for All", img: "./assets/dummy-male.png", badgeTitle: "Generous Giver" },
      { id: 3, name: "Charlie Davis", totalDonations: 9000, topSupportedProject: "Eco-Friendly Homes", img: "./assets/dummy-male.png", badgeTitle: "Star Donor" },
      { id: 4, name: "Daniel Lee", totalDonations: 8700, topSupportedProject: "Medical Aid", img: "./assets/dummy-male.png" },
      { id: 5, name: "Emma Watson", totalDonations: 8200, topSupportedProject: "Solar Power Schools", img: "./assets/dummy-female.png" },
      { id: 6, name: "Franklin Harris", totalDonations: 8000, topSupportedProject: "Refugee Support Fund", img: "./assets/dummy-male.png" },
      { id: 7, name: "Grace Miller", totalDonations: 7800, topSupportedProject: "Wildlife Protection", img: "./assets/dummy-female.png" },
      { id: 8, name: "Jack Wilson", totalDonations: 7600, topSupportedProject: "Disaster Relief", img: "./assets/dummy-male.png" },
      { id: 9, name: "Sophia Green", totalDonations: 7400, topSupportedProject: "Mental Health Awareness", img: "./assets/dummy-female.png" },
    ],
    monthly: [
      { id: 1, name: "Grace Miller", totalDonations: 2500, topSupportedProject: "Medical Aid", img: "./assets/dummy-female.png", badgeTitle: "Star Donor" },
      { id: 2, name: "Henry Clark", totalDonations: 2200, topSupportedProject: "Eco-Friendly Homes", img: "./assets/dummy-male.png", badgeTitle: "Monthly Hero" },
      { id: 3, name: "Isabel Moore", totalDonations: 2100, topSupportedProject: "Education for All", img: "./assets/dummy-female.png", badgeTitle: "Generous Soul" },
      { id: 4, name: "Ethan Carter", totalDonations: 1900, topSupportedProject: "Wildlife Protection", img: "./assets/dummy-male.png" },
      { id: 5, name: "Ava Martinez", totalDonations: 1800, topSupportedProject: "Mental Health Awareness", img: "./assets/dummy-female.png" },
      { id: 6, name: "Michael Brown", totalDonations: 1750, topSupportedProject: "Disaster Relief", img: "./assets/dummy-male.png" },
      { id: 7, name: "Sophia Green", totalDonations: 1600, topSupportedProject: "Food Aid Program", img: "./assets/dummy-female.png" },
    ],
  },
  OneTimeTopDonation: {
    allTime: [
      { id: 1, name: "Sophie Tan", singleDonation: 10000, supportedProject: "Medical Aid for Refugees", img: "./assets/dummy-female.png", badgeTitle: "Legendary Supporter" },
      { id: 2, name: "Daniel Carter", singleDonation: 9500, supportedProject: "Education for Girls", img: "./assets/dummy-male.png", badgeTitle: "Gold Benefactor" },
      { id: 3, name: "Zhang Wei", singleDonation: 9000, supportedProject: "Emergency Food Aid", img: "./assets/dummy-male.png", badgeTitle: "Platinum Donor" },
      { id: 4, name: "Ava Martinez", singleDonation: 8500, supportedProject: "Eco-Friendly Homes", img: "./assets/dummy-female.png" },
      { id: 5, name: "William Jones", singleDonation: 8200, supportedProject: "Wildlife Protection", img: "./assets/dummy-male.png" },
      { id: 6, name: "Emily Davis", singleDonation: 8000, supportedProject: "Solar Power Schools", img: "./assets/dummy-female.png" },
      { id: 7, name: "Christopher Lee", singleDonation: 7800, supportedProject: "Clean Water Initiative", img: "./assets/dummy-male.png" },
    ],
    monthly: [
      { id: 1, name: "Ethan Brown", singleDonation: 3000, supportedProject: "Clean Water Initiative", img: "./assets/dummy-male.png", badgeTitle: "Generous Heart" },
      { id: 2, name: "Olivia Wilson", singleDonation: 2800, supportedProject: "Eco-Friendly Homes", img: "./assets/dummy-female.png", badgeTitle: "Giving Star" },
      { id: 3, name: "Benjamin Taylor", singleDonation: 2700, supportedProject: "Education for Girls", img: "./assets/dummy-male.png", badgeTitle: "Top Contributor" },
      { id: 4, name: "Sophia Green", singleDonation: 2500, supportedProject: "Medical Aid", img: "./assets/dummy-female.png" },
      { id: 5, name: "David Clark", singleDonation: 2300, supportedProject: "Disaster Relief", img: "./assets/dummy-male.png" },
      { id: 6, name: "Lily Carter", singleDonation: 2200, supportedProject: "Food Aid Program", img: "./assets/dummy-female.png" },
    ],
  },
  MostActiveSupporters: {
    allTime: [
      { id: 1, name: "Daniel Lee", donationCount: 30, avgDonationSize: 300, img: "./assets/dummy-male.png", badgeTitle: "Super Supporter" },
      { id: 2, name: "Emma Watson", donationCount: 28, avgDonationSize: 280, img: "./assets/dummy-female.png", badgeTitle: "Donation Dynamo" },
      { id: 3, name: "Oliver White", donationCount: 26, avgDonationSize: 260, img: "./assets/dummy-male.png", badgeTitle: "Charity Champion" },
      { id: 4, name: "Sophia Brown", donationCount: 24, avgDonationSize: 250, img: "./assets/dummy-female.png" },
      { id: 5, name: "Henry Adams", donationCount: 22, avgDonationSize: 230, img: "./assets/dummy-male.png" },
      { id: 6, name: "Lucas Martinez", donationCount: 21, avgDonationSize: 220, img: "./assets/dummy-male.png" },
      { id: 7, name: "Emily Wilson", donationCount: 20, avgDonationSize: 210, img: "./assets/dummy-female.png" },
    ],
    monthly: [
      { id: 1, name: "Charlie Davis", donationCount: 10, avgDonationSize: 100, img: "./assets/dummy-male.png", badgeTitle: "Active Star" },
      { id: 2, name: "Alice Johnson", donationCount: 9, avgDonationSize: 110, img: "./assets/dummy-female.png", badgeTitle: "Giving Hero" },
      { id: 3, name: "Jack Thompson", donationCount: 8, avgDonationSize: 105, img: "./assets/dummy-male.png", badgeTitle: "Monthly Donor" },
      { id: 4, name: "Sophia Green", donationCount: 7, avgDonationSize: 98, img: "./assets/dummy-female.png" },
      { id: 5, name: "Ryan Evans", donationCount: 6, avgDonationSize: 95, img: "./assets/dummy-male.png" },
      { id: 6, name: "Natalie Foster", donationCount: 6, avgDonationSize: 92, img: "./assets/dummy-female.png" },
    ],
  },
};

// Leaderboard Component
export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<keyof typeof leaderboardData>("TopContributors");
  const [timeFrame, setTimeFrame] = useState<"allTime" | "monthly">("allTime");

  // Extract relevant data based on the selected tab and timeframe
  const entries = leaderboardData[activeTab][timeFrame] || [];
  const top3 = entries.slice(0, 3);
  const others = entries.slice(3);

  // Default values for missing data
  const defaultEntry: LeaderboardEntry = { id: 0, name: "N/A", img: "./assets/default.jpg" };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-title-container">
        <h1 className="leaderboard-title">Leaderboard</h1>
      </div>

      {/* Tabs to switch between leaderboard categories */}
      <div className="leaderboard-tabs">
        {Object.keys(leaderboardData).map((key) => (
          <button
            key={key}
            className={`tabs-button ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key as keyof typeof leaderboardData)}
          >
            {key.replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>

      <div className="breaker"></div>

      {/* Timeframe selection buttons */}
      <div className="timeframe-buttons">
        {["allTime", "monthly"].map((tf) => (
          <button
            key={tf}
            className={`timeframe-button ${timeFrame === tf ? "active" : ""}`}
            onClick={() => setTimeFrame(tf as "allTime" | "monthly")}
          >
            {tf === "allTime" ? "All Time" : "This Month"}
          </button>
        ))}
      </div>

      {/* Leaderboard ranking */}
      <div className="leaderboard-list">
        {/* Top 3 Podium Display */}
        <div className="top-three">
          {[top3[1] || defaultEntry, top3[0] || defaultEntry, top3[2] || defaultEntry].map((person, index) => (
            <div key={index} className={`leaderboard-card position-${index}`}>
              <img src={person.img || "./assets/default.jpg"} alt={person.name} className="avatar" />
              <p className="name">{person.name}</p>

              {/* Dynamically show relevant value based on activeTab */}
              {activeTab === "TopContributors" && <p className="ach-amount">${person.totalDonations}</p>}
              {activeTab === "OneTimeTopDonation" && <p className="ach-amount">${person.singleDonation}</p>}
              {activeTab === "MostActiveSupporters" && <p className="ach-amount">{person.donationCount} donations</p>}

              <div className="badges">{person.badgeTitle}</div>
            </div>
          ))}
        </div>

        {/* List of other ranked donors/projects */}
        {others.length > 0 && (
          <div className="other-entries">
            {others.map((entry, index) => (
              <div key={entry.id} className="leaderboard-entry">
                <div className="entry-details">
                  <span className="rank">{index + 4}</span>
                  <img src={entry.img || "./assets/default.jpg"} alt={entry.name} className="avatar" />
                  <p className="name">{entry.name}</p>
                </div>

                {/* Dynamically show relevant value */}
                {activeTab === "TopContributors" && <p className="ach-amount">${entry.totalDonations}</p>}
                {activeTab === "OneTimeTopDonation" && <p className="ach-amount">${entry.singleDonation}</p>}
                {activeTab === "MostActiveSupporters" && <p className="ach-amount">{entry.donationCount} donations</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
