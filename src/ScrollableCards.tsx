import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import './ScrollableCards.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';

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

  useEffect(() => {
    const fetchLatestProjects = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'projects'),
          orderBy('updatedAt', 'desc'),
          limit(10) // You can increase this if needed
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            title: data.title,
            status: data.status,
            description: data.subtitle,
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

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div className="scrollable-cards-wrapper relative px-30 pb-20">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        spaceBetween={20}
        slidesPerView={1.2}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
        }}
        className="!static !py-5 !px-3"
      >
        {projects.map(project => {
          const progress = project.goalAmount > 0
            ? Math.round((project.raisedAmount / project.goalAmount) * 100)
            : 0;

          return (
            <SwiperSlide key={project.id}>
              <div
                className="project-card h-[450px]"
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
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ScrollableCards;
