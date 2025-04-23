import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import './ScrollableCards.css';

interface ProjectPreview {
  id: string;
  title: string;
  status: string;
  description: string;
  mainImage: string;
  goalAmount: number;
  raisedAmount: number;
}

const ScrollableCards: React.FC = () => {
  const [projects, setProjects] = useState<ProjectPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLatestProjects = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'projects'),
          orderBy('updatedAt', 'desc'),
          limit(4)
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            title: data.title,
            status: data.status,
            description: data.description,
            mainImage: data.mainImage,
            goalAmount: data.goalAmount,
            raisedAmount: data.raisedAmount,
          };
        });
        setProjects(items);
      } catch (error) {
        console.error('Error fetching latest projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProjects();
  }, []);

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

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div className="scrollable-cards-wrapper">
      <button className="scroll-button left" onClick={scrollLeft} aria-label="Scroll left">
        ‹
      </button>

      <div className="cards-scroll-container" ref={scrollContainerRef}>
        {projects.map(project => {
          const progress = project.goalAmount > 0
            ? Math.round((project.raisedAmount / project.goalAmount) * 100)
            : 0;

          return (
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
                src={project.mainImage}
                alt={project.title}
              />
              <div className="project-progress">
                <div className="progress-label">Progress: {progress}%</div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="project-description">{project.description}</p>
            </div>
          );
        })}
      </div>

      <button className="scroll-button right" onClick={scrollRight} aria-label="Scroll right">
        ›
      </button>
    </div>
  );
};

export default ScrollableCards;
