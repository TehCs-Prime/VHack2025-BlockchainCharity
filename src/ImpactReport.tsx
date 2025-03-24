// src/pages/ImpactReport.tsx
import "./ImpactReport.css";

// Define TypeScript interfaces for better type safety
interface ImpactMetric {
  id: number;
  title: string;
  value: string;
  trend: string;
  icon: string;
}

interface RecentActivity {
  id: number;
  time: string;
  event: string;
}

export default function ImpactReport() {
  // Mock data for prototype with defined types
  const impactMetrics: ImpactMetric[] = [
    { id: 1, title: "Meals Provided", value: "24,582", trend: "↑ 12%", icon: "🍲" },
    { id: 2, title: "Trees Planted", value: "8,429", trend: "↑ 5%", icon: "🌳" },
    { id: 3, title: "Students Educated", value: "1,243", trend: "↑ 8%", icon: "📚" },
    { id: 4, title: "CO2 Reduced (tons)", value: "582", trend: "↓ 3%", icon: "🌍" },
  ];

  const recentActivities: RecentActivity[] = [
    { id: 1, time: "2 mins ago", event: "Donation received for Clean Water Project" },
    { id: 2, time: "15 mins ago", event: "Education kits delivered to rural school" },
    { id: 3, time: "1 hour ago", event: "Solar panel installation completed" },
  ];

  return (
    <div className="impact-container">
      <div className="impact-header">
        <h1>Real-Time Impact Report</h1>
        <p className="last-updated">Last updated: Just now</p>
      </div>

      <div className="metrics-grid">
        {impactMetrics.map((metric) => (
          <div key={metric.id} className="metric-card">
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <h3>{metric.title}</h3>
              <div className="metric-value">
                <span>{metric.value}</span>
                <span className="trend">{metric.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="impact-sections">
        <div className="activity-feed">
          <h2>Recent Activities</h2>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <span className="activity-time">{activity.time}</span>
                <p className="activity-event">{activity.event}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="impact-map">
  <h2>Global Impact</h2>
  <div className="map-visualization">
    <img 
      src="public\assets\marked_world_map.jpg" 
      alt="Global Impact Map" 
      className="map-image"
    />
    <div className="map-marker" style={{ left: "30%", top: "40%" }}>🇰🇪</div>
    <div className="map-marker" style={{ left: "55%", top: "60%" }}>🇧🇷</div>
    <div className="map-marker" style={{ left: "70%", top: "30%" }}>🇮🇳</div>
  </div>
</div>

        </div>
      </div>
  );
}
