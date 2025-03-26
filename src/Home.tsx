import React,{ useState } from 'react';
import RollingBanner from './RollingBanner';
import ScrollableCard from './ScrollableCards'
import { Globe, Users, Rocket, Layers } from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
  const features = [
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'Empowering charities worldwide to respond swiftly to crises and drive humanitarian aid.'
  },
  {
    icon: Users,
    title: 'Secure & Compliant',
    description: 'Ensuring robust, cryptographic security and strict adherence to international charity regulations.'
  },
  {
    icon: Rocket,
    title: 'Innovative Tech',
    description: 'Leveraging blockchain, smart contracts, and AI-driven insights to streamline transactions.'
  },
  {
    icon: Layers,
    title: 'Transparent Tracking',
    description: 'Offering real-time updates, traceability, and accountability for every donation.'
  }
];
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1000);
  };

  return (
    <div className="home">

      <div className='intro-container'>
        
      <div className="hearts-wrapper">
      <div 
      className={`heart-container ${isClicked ? 'burst' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      aria-label="Support Charity"
    >
      <div className="heart">
        {isHovered && (
          <div className="donation-message">
            <span>"Empowering Changes</span>
            <span>Uplifting Lives"</span>
          </div>
        )}
      </div>
      <div className="sparkles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="spark" />
        ))}
      </div>
        <div className="small-heart small-heart-1"></div>
        <div className="small-heart small-heart-2"></div>
        <div className="small-heart small-heart-3"></div>
        <div className="small-heart small-heart-4"></div>
        <div className="small-heart small-heart-5"></div>
        <div className="small-heart small-heart-6"></div>
    </div>
    </div>

        <div className='intro-words'>
          <div className='intro-title'>Pioneering Solutions for Social Transformation</div>
          <div className='intro-des'>We as <strong>LaCial Charity</strong>, a non-profit organization dedicated to empower communities with Web3 Blockchain technology.</div>
        </div>
      </div>

      <div className="why-us-container">
        <h2 className="why-us-title">Why Us?</h2>
        <div className="why-us-underline"></div>
        <div className="why-us-features">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                <feature.icon className="feature-icon" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
      </div>
    </div>
      <div className="landing-container">
        <h1 className="landing-title">Ready to Start?</h1>
        <div className="landing-options">
          <div className="landing-option">
            <div className="icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <path d="M12 22l10-10a4 4 0 00-5.66-5.66l-1.34 1.34L11 7 8.24 4.24a4 4 0 00-5.66 5.66l10 10z" />
              </svg>
            </div>
            <h2>Donate</h2>
            <p>Explore projects to contribute to around the world.</p>
            <button className="cta-button"><a href='/explore'>Discover Projects</a></button>
          </div>
          <div className="landing-option">
            <div className="icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h2>Start a Project</h2>
            <p>Nonprofits ready to fundraise can start a project here.</p>
            <button className="cta-button"><a href='/login'>Fundraise</a></button>
          </div>
        </div>
      </div>
        <div className='Recommendation'>Just For You</div>
        <div className="why-us-underline"></div>
        <div className='Cards'><ScrollableCard /></div>
      <RollingBanner />
    </div>
  );
};

export default Home;
