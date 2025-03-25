import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImpactReport.css";
import ScrollableCards from "./ScrollableCards";

// Define TypeScript interfaces for better type safety
interface ImpactMetric {
  id: number;
  title: string;
  value: string;
  trend: string;
  icon: string;
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
  const navigate = useNavigate();

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

  // Data for the impact metrics (summary section)
  const impactMetrics: ImpactMetric[] = [
    { id: 1, title: "Meals Provided", value: "24,582", trend: "↑ 12%", icon: "🍲" },
    { id: 2, title: "Trees Planted", value: "8,429", trend: "↑ 5%", icon: "🌳" },
    { id: 3, title: "Students Educated", value: "1,243", trend: "↑ 8%", icon: "📚" },
    { id: 4, title: "CO2 Reduced (tons)", value: "582", trend: "↓ 3%", icon: "🌍" },
  ];

  // Data for user comments (only using first 3 for display)
  const userComments: Comment[] = [
    {
      id: 1,
      name: "Alice Johnson",
      date: "March 1, 2025",
      comment: "I was truly amazed by the clean water initiative. Their efforts have made a lasting impact on our village.",
    },
    {
      id: 2,
      name: "Bob Smith",
      date: "March 3, 2025",
      comment: "The education outreach program has been a game-changer. My children now have access to better resources.",
    },
    {
      id: 3,
      name: "Charlie Davis",
      date: "March 5, 2025",
      comment: "The solar panel project brought electricity to our region and provided training for local technicians.",
    },
    {
      id: 4,
      name: "Diana Lee",
      date: "March 6, 2025",
      comment: "Participating in the sustainable farming workshop was eye-opening and boosted local agriculture.",
    },
  ];

  // State to track the current hero slide
  const [currentSlide, setCurrentSlide] = useState(0);

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
        <ScrollableCards />
      </section>

      {/* USER COMMENTS SECTION */}
      <section className="user-comments">
        <h2>What People Are Saying</h2>
        <div className="comments-grid">
          {userComments.slice(0, 3).map((comment) => (
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

      {/* CALL-TO-ACTION SECTION */}
      <section className="cta-section">
        <h2>Join Us In Making a Difference</h2>
        <p>Your support helps us keep making an impact around the world.</p>
        <button 
          className="cta-button"
          onClick={() => {
            navigate("/explore");
            window.scrollTo(0, 0);
          }}
        >
          Donate Now
        </button>
      </section>
    </div>
  );
}
