import { useState } from "react";
import "./Leaderboard.css"

interface LeaderboardEntry {
  id: number;
  name: string;
  amount?: string;
  funds?: string;
  events?: number;
  img?: string;
}

interface LeaderboardData {
  [key: string]: {
    allTime: LeaderboardEntry[];
    monthly: LeaderboardEntry[];
  };
}

const leaderboardData: LeaderboardData = {
  TopContributors: {
    allTime: [
      { id: 1, name: "Alice Johnson", amount: "$10,000", img: "./assets/dummy-female.png" },
      { id: 2, name: "Bob Smith", amount: "$9,500", img: "./assets/dummy-male.png" },
      { id: 3, name: "Charlie Davis", amount: "$9,000", img: "./assets/dummy-male.png" },
      { id: 4, name: "Daniel Lee", amount: "$8,500", img: "./assets/dummy-male.png" },
      { id: 5, name: "Emma Watson", amount: "$8,000", img: "./assets/dummy-female.png" },
    ],
    monthly: [
      { id: 1, name: "Grace Miller", amount: "$2,500", img: "./assets/dummy-female.png" },
      { id: 2, name: "Henry Clark", amount: "$2,200", img: "./assets/dummy-male.png" },
      { id: 3, name: "Isabel Moore", amount: "$2,100", img: "./assets/dummy-female.png" },
    ],
  },
  BestFundedProjects: {
    allTime: [
      { id: 1, name: "Clean Water Initiative", amount: "$100,000" },
      { id: 2, name: "Education for All", amount: "$95,000" },
      { id: 3, name: "Eco-Friendly Homes", amount: "$90,000" },
    ],
    monthly: [
      { id: 1, name: "Solar Power Schools", amount: "$20,000" },
      { id: 2, name: "Medical Aid", amount: "$18,000" },
    ],
  },
  MostActiveSupporters: {
    allTime: [
      { id: 1, name: "Daniel Lee", events: 30, img: "./assets/dummy-male.png" },
      { id: 2, name: "Emma Watson", events: 28, img: "./assets/dummy-female.png" },
    ],
    monthly: [
      { id: 1, name: "Charlie Davis", events: 10, img: "./assets/dummy-male.png" },
      { id: 2, name: "Alice Johnson", events: 9, img: "./assets/dummy-female.png" },
    ],
  },
  TopFundraisers: {
    allTime: [
      { id: 1, name: "Grace Miller", funds: "$50,000", img: "./assets/dummy-female.png" },
      { id: 2, name: "Henry Clark", funds: "$45,000", img: "./assets/dummy-male.png" },
    ],
    monthly: [
      { id: 1, name: "Isabel Moore", funds: "$15,000", img: "./assets/dummy-female.png" },
      { id: 2, name: "Emma Watson", funds: "$12,000", img: "./assets/dummy-female.png" },
    ],
  },
};

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<keyof LeaderboardData>("TopContributors");
  const [timeFrame, setTimeFrame] = useState<"allTime" | "monthly">("allTime");

  const top3 = leaderboardData[activeTab][timeFrame].slice(0, 3);
  const others = leaderboardData[activeTab][timeFrame].slice(3);

  const first = top3[0] || { name: "N/A", amount: "$0", img: "/default.jpg" };
  const second = top3[1] || { name: "N/A", amount: "$0", img: "/default.jpg" };
  const third = top3[2] || { name: "N/A", amount: "$0", img: "/default.jpg" };

  return (
    <div className="leaderboard-container">

      <div className="leaderboard-title-container">
        <h1 className="leaderboard-title">Leaderboard</h1>
      </div>

      <div className="leaderboard-tabs">
        {Object.keys(leaderboardData).map((key) => (
          <button
            key={key}
            className={`tabs-button ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key as keyof LeaderboardData)}
          >
            {key.replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>

      <div className="breaker"></div>

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

      <div className="leaderboard-list">
        <div className="top-three">
          {[second, first, third].map((person, index) => (
            <div key={index} className={`leaderboard-card position-${index}`}>
              <img src={person.img || "./dummy.png"} alt={person.name} className="avatar" />
              <p className="name">{person.name}</p>
              <p className="ach-amount">{person.amount}</p>
            </div>
          ))}
        </div>

        {others.length > 0 && (
          <div className="other-entries">
            {others.map((entry, index) => (
              <div key={entry.id} className="leaderboard-entry">
                <div className="entry-details">
                  <span className="rank">{index + 4}</span>
                  <img src={entry.img} alt={entry.name} className="avatar" />
                  <p className="name">{entry.name}</p>
                </div>
                <p className="ach-amount">{entry.amount}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
