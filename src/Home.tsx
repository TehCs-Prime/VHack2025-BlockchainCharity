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
    <div>
      <div className='grid grid-cols-2 gap-4 items-center justify-items-center h-[85vh]'>
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

        <div>
          <div className='font-bold text-4xl pb-4'>Pioneering Solutions for Social Transformation</div>
          <div className='text-xl w-[40vw]'>We as <strong>LaCial Charity</strong>, a non-profit organization dedicated to empower communities with Web3 Blockchain technology.</div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center py-10">
        <h2 className="text-4xl font-bold text-[#2d3748] pb-6">Why Us?</h2>
        <div className="w-16 h-2 bg-yellow-400 mb-8"></div>
        <div className="flex justify-between flex-start gap-10 select-none px-16">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center py-12 px-6 bg-[#fffed9] min-h-[280px] box-shadow-lg rounded-xl">
              <div className="w-16 h-16 bg-[#fff4e6] rounded-full flex items-center justify-center mb-4">
                <feature.icon className="text-[#ff8a00] w-8 h-8" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    
      <div className="flex flex-col items-center text-center py-10">
        <h2 className="text-4xl font-bold text-[#2d3748] pb-6">Ready to Start?</h2>
        <div className="w-16 h-2 bg-yellow-400 mb-16"></div>
        <div className="landing-options h-[60vh] ">
          <div className="flex flex-col items-center justify-center rounded-3xl box-shadow-lg bg-yellow-300 px-10 py-8 mb-8 w-[22vw]">
            <div className="bg-white rounded-full p-3 w-16 h-16 mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                <path d="M12 22l10-10a4 4 0 00-5.66-5.66l-1.34 1.34L11 7 8.24 4.24a4 4 0 00-5.66 5.66l10 10z" />
              </svg>
            </div>
            <h2 className='text-xl text-gray-800 font-semibold my-2'>Donate</h2>
            <p className="mb-12 text-gray-700">Explore projects to contribute to around the world.</p>
            <button className="cursor-pointer border-white border-2 bg-transparent text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:bg-white hover:text-yellow-400"><a href='/explore'>Discover Projects</a></button>
          </div>
          <div className="flex flex-col items-center justify-center rounded-3xl box-shadow-lg bg-yellow-300 px-10 py-8 mb-8 w-[22vw]">
            <div className="bg-white rounded-full p-3 w-16 h-16 mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h2 className='text-xl text-gray-800 font-semibold my-2'>Start a Project</h2>
            <p className="mb-12 text-gray-700">Nonprofits ready to fundraise can start a project here.</p>
            <button className="border-white border-2 bg-transparent text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:bg-white hover:text-yellow-400 cursor-pointer"><a href='/login'>Fundraise</a></button>
          </div>
        </div>
      </div>
        
      <div className='flex flex-col items-center text-center py-10'>
        <div className='Recommendation'>Just For You</div>
        <div className="w-16 h-2 bg-yellow-400"></div>
      </div>
      
      <div className='Cards'><ScrollableCard /></div>
      <RollingBanner />
    </div>
  );
};

export default Home;
