import React from 'react';
import RollingBanner from './RollingBanner';
import ScrollableCard from './ScrollableCards'
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
        <div className='Recommendation'>Just For You</div>
        <div className='Cards'><ScrollableCard /></div>
      <RollingBanner />
    </div>
  );
};

export default Home;
