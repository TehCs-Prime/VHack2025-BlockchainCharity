import { useState } from "react";
import "./ImpactReport.css";

// Define TypeScript interfaces for better type safety
interface ImpactMetric {
  id: number;
  title: string;
  value: string;
  trend: string;
  icon: string;
}

interface Activity {
  id: number;
  image?: string; // Placeholder image URL; can be updated later
  title: string;
  description: string;
  date: string;
}

interface Comment {
  id: number;
  name: string;
  comment: string;
  date: string;
}

interface HeroSlide {
  id: number;
  title: string;
  description: string;
  image: string; // Background image URL for the slide
}

export default function ImpactReport() {
  // Data for the hero carousel (three slides) with different background images
  const heroSlides: HeroSlide[] = [
    { 
      id: 1, 
      title: "Project One", 
      description: "Transforming local communities through sustainable agriculture and education.", 
      image: "public/assets/gallery1.jpg" 
    },
    { 
      id: 2, 
      title: "Project Two", 
      description: "Empowering youth with innovative learning and skill development programs.", 
      image: "public/assets/gallery2.jpg" 
    },
    { 
      id: 3, 
      title: "Project Three", 
      description: "Building resilient infrastructure and clean energy solutions across regions.", 
      image: "public/assets/gallery3.jpg" 
    },
  ];

  // State to track the current hero slide
  const [currentSlide, setCurrentSlide] = useState(0);

  // Data for the impact metrics (summary section)
  const impactMetrics: ImpactMetric[] = [
    { id: 1, title: "Meals Provided", value: "24,582", trend: "↑ 12%", icon: "🍲" },
    { id: 2, title: "Trees Planted", value: "8,429", trend: "↑ 5%", icon: "🌳" },
    { id: 3, title: "Students Educated", value: "1,243", trend: "↑ 8%", icon: "📚" },
    { id: 4, title: "CO2 Reduced (tons)", value: "582", trend: "↓ 3%", icon: "🌍" },
  ];

  // Data for recent activities (cards with image placeholders)
  const recentActivities: Activity[] = [
    { id: 1, title: "Clean Water Initiative", description: "Donation received and community water filter installed.", date: "March 1, 2025", image: "public/assets/placeholder1.jpg" },
    { id: 2, title: "Education Outreach", description: "Delivered education kits to remote schools.", date: "March 3, 2025", image: "public/assets/placeholder2.jpg" },
    { id: 3, title: "Solar Panel Project", description: "Completed installation for rural electrification.", date: "March 5, 2025", image: "public/assets/placeholder3.jpg" },
    { id: 4, title: "Sustainable Farming Workshop", description: "Community workshop held on modern farming techniques.", date: "March 6, 2025", image: "public/assets/placeholder4.jpg" },
  ];

  // Data for user comments (longer, detailed feedback)
  const userComments: Comment[] = [
    {
      id: 1,
      name: "Alice Johnson",
      date: "March 1, 2025",
      comment: "I was truly amazed by the clean water initiative. Not only did they provide a sustainable solution, but they also involved local community members in the process, ensuring long-term success and self-reliance. Their efforts have made a lasting impact on our village.",
    },
    {
      id: 2,
      name: "Bob Smith",
      date: "March 3, 2025",
      comment: "The education outreach program has been a game-changer. My children now have access to learning resources that were previously unavailable in our area. The dedicated team made sure every detail was attended to, and the results speak for themselves. I am proud to be associated with such impactful work.",
    },
    {
      id: 3,
      name: "Charlie Davis",
      date: "March 5, 2025",
      comment: "The solar panel project is remarkable. It brought electricity to a region that had struggled for years. The project not only reduced energy costs but also provided training for local technicians. It’s inspiring to see how renewable energy can transform lives and empower communities.",
    },
    {
      id: 4,
      name: "Diana Lee",
      date: "March 6, 2025",
      comment: "Participating in the sustainable farming workshop was an eye-opening experience. The program combined traditional practices with modern techniques, helping us understand how to better manage our resources. This initiative has boosted local agriculture and fostered a sense of community pride.",
    },
  ];

  // Navigation handlers for hero slider
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="impact-container">
      
      {/* HERO CAROUSEL SECTION */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroSlides[currentSlide].image})` }}
      >
        <div className="hero-overlay"></div>

        {/* Navigation buttons placed directly inside .hero */}
        <button onClick={prevSlide} className="hero-nav-btn left-btn">
          <span className="arrow-symbol">&#10094;</span>
        </button>
        <button onClick={nextSlide} className="hero-nav-btn right-btn">
          <span className="arrow-symbol">&#10095;</span>
        </button>

        <div className="hero-content">
          <h1>{heroSlides[currentSlide].title}</h1>
          <p>{heroSlides[currentSlide].description}</p>
        </div>
        <div className="hero-dots">
          {heroSlides.map((slide, index) => (
            <span
              key={slide.id}
              className={`dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </section>
      
      {/* SUMMARY SECTION */}
      <section className="summary">
        <h2>Our Impact in Numbers</h2>
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
      </section>

      {/* IMPACT MAP SECTION */}
      <section className="impact-map">
        <h2>Global Impact Map</h2>
        <div className="map-visualization">
          <img 
            src="public/assets/map.jpg" 
            alt="Global Impact Map" 
            className="map-image"
          />
          <div className="map-marker" style={{ left: "30%", top: "40%" }}>🇰🇪</div>
          <div className="map-marker" style={{ left: "55%", top: "60%" }}>🇧🇷</div>
          <div className="map-marker" style={{ left: "70%", top: "30%" }}>🇮🇳</div>
        </div>
        <p className="impact-summary">
          We improved lives and futures in 17 countries around the world.
        </p>
      </section>

      {/* RECENT ACTIVITIES SECTION */}
      <section className="recent-activities">
        <h2>Recent Activities</h2>
        <div className="activities-grid">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-card">
              <div className="activity-image">
                <img src={activity.image} alt={activity.title} />
              </div>
              <div className="activity-details">
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
                <span className="activity-date">{activity.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* USER COMMENTS SECTION */}
      <section className="user-comments">
        <h2>What People Are Saying</h2>
        <div className="comments-grid">
          {userComments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <p className="comment-text">"{comment.comment}"</p>
              <div className="comment-info">
                <span className="commenter-name">{comment.name}</span>
                <span className="comment-date">{comment.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL-TO-ACTION / FOOTER */}
      <section className="cta-section">
        <h2>Join Us In Making a Difference</h2>
        <p>Your support helps us keep making an impact around the world.</p>
        <button className="cta-button">Donate Now</button>
      </section>
    </div>
  );
}
