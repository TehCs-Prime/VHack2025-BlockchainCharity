import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScrollableCards.css';

interface Project {
  id: number;
  title: string;
  status: string;
  timing: string;
  category: string;
  location: string;
  description: string;
  updatedAt: Date;
  progress: number;
  imageUrl: string;
}

const mockProjects: Project[] = [
  {
    id: 1,
    title: 'Clean Water Initiative',
    status: 'Under Implementation',
    timing: 'New Project',
    category: 'Water',
    location: 'Kenya',
    description: 'Providing clean water access to rural communities',
    updatedAt: new Date('2025-02-15'),
    progress: 65,
    imageUrl: '/assets/CleanAir.jpeg',
  },
  {
    id: 2,
    title: 'Education for All',
    status: 'Funding',
    timing: 'New Project',
    category: 'Education',
    location: 'India',
    description: 'Building schools in underserved areas',
    updatedAt: new Date('2025-03-01'),
    progress: 30,
    imageUrl: '/assets/Education.jpeg',
  },
  {
    id: 3,
    title: 'Wildlife Conservation',
    status: 'Completed',
    timing: 'Near to End',
    category: 'Animals',
    location: 'Brazil',
    description: 'Protecting endangered species in the Amazon',
    updatedAt: new Date('2025-01-20'),
    progress: 100,
    imageUrl: '/assets/Jungle.jpeg',
  },
];

const ScrollableCards: React.FC = () => {
  const navigate = useNavigate();

  // 1) Create a reference for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 2) Functions to handle left/right scrolling
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 300;
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 300;
    }
  };

  return (
    <div className="scrollable-cards-wrapper">
      {/* Left Arrow Button */}
      <button className="scroll-button left" onClick={scrollLeft}>
        <i className='NaviArrow'> &#8592; </i>
      </button>

      {/* Scrollable container with a ref */}
      <div className="cards-scroll-container" ref={scrollContainerRef}>
        {mockProjects.map((project) => (
          <div
            className="project-card"
            key={project.id}
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <div className="project-status" data-status={project.status}>
              {project.status}
            </div>
            <h3 className="project-title">{project.title}</h3>
            <img
              className="project-image"
              src={project.imageUrl}
              alt={project.title}
            />
            <div className="project-progress">
              <div className="progress-label">Progress: {project.progress}%</div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
            <p className="project-description">{project.description}</p>
          </div>
        ))}
      </div>

      {/* Right Arrow Button */}
      <button className="scroll-button right" onClick={scrollRight}>
        <i className='NaviArrow'> &#8594; </i>
      </button>
    </div>
  );
};

export default ScrollableCards;
