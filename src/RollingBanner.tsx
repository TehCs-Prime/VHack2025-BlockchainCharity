import React from 'react';
import './RollingBanner.css'

import Sponsor1 from '/assets/Sponsor1.png';
import Sponsor2 from '/assets/Sponsor2.png';
import Sponsor3 from '/assets/Sponsor3.png';
import Sponsor4 from '/assets/Sponsor4.png';
import Sponsor5 from '/assets/Sponsor5.png';
import Sponsor6 from '/assets/Sponsor6.png';
import Sponsor7 from '/assets/Sponsor7.png'; 
import Sponsor8 from '/assets/Sponsor8.png'; 
import Sponsor9 from '/assets/Sponsor9.png'; 
import Sponsor10 from '/assets/Sponsor10.png'; 

const RollingBanner: React.FC = () => {
  // An array of sponsor logos to be rendered
  const sponsors = [
    { src: Sponsor1, alt: 'People In Need' },
    { src: Sponsor2, alt: 'One Tree Planted' },
    { src: Sponsor3, alt: 'Unicef' },
    { src: Sponsor4, alt: 'Koala Clancy Foundation' },
    { src: Sponsor5, alt: 'Women in Tech' },
    { src: Sponsor6, alt: 'We Care' },
    { src: Sponsor7, alt: 'UNHCR' },
    { src: Sponsor8, alt: 'Reforest Action' },
    { src: Sponsor9, alt: 'Mercy Crops' },
    { src: Sponsor10, alt: 'University of Science Malaysia' },
  ];

  return (
    <div className="rolling-banner">
      <div className="rolling-banner__track">
        {/* Render the logos twice for seamless looping */}
        {[...sponsors, ...sponsors].map((sponsor, index) => (
          <div className="rolling-banner__item" key={index}>
            <img src={sponsor.src} alt={sponsor.alt} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RollingBanner;
