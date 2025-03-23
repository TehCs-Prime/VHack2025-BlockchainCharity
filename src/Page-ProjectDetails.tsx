import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './Page-ProjectDetails.css';

import Logo from '/assets/Logo.png';
import silageTarpImage from '/assets/Logo.png';


import DonorTab from './Tab-Donors';
import AllocationsTab from './Tab-Allocations';
import UpdatesTab from './Tab-Updates';
import MilestoneTab from './Tab-Milestone';

// Define project interface
interface Project {
  id: number;
  title: string;
  status: 'Funding' | 'Under Implementation' | 'Completed' | 'Cancelled';
  subtitle?: string;
  description: string;
  location: string;
  goalAmount: number;
  raisedAmount: number;
  raisedCrypto?: string;
  category: string;
  updatedAt: Date;
  mainImage: string;
  allocatedAmount: number;
  pendingAmount: number;
  donorsCount: number;
  beneficiariesCount: number;
  eventDate?: Date;
  eventDescription?: string;
  organizationsInfo?: string;
  lastUpdated?: string;
  photoCredit?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    telegram?: string;
    ins?: string;
    vk?: string;
  };
}

interface Donation {
    id: number;
    currency: string;
    amount: number;
    donor: string;
    date: string;
    message: string | null;
}

interface Allocation {
    id: number;
    receiver: string;
    date: string;
    amount: number;
    currency: string;
    useOfFunds: string | null;
}

interface NewsUpdate {
    id: number;
    title: string;
    date: string;
    author: string;
    content: string;
    imageUrl: string;
}

const newsData: NewsUpdate[] = [
    {
      id: 1,
      title: "The tunnels & tarps have arrived",
      date: "May 04, 2021",
      author: "Micah McLain",
      content: "A quick update: the caterpillar tunnels and silage tarps from our friends at Farmers Friend have arrived. The tractor from Carr's is currently on order but we'll continue to keep our supporters updated as we put these tools into action to transform the lives of small farmers.",
      imageUrl: "/assets/Logo.png"
    },
    {
      id: 2,
      title: "New irrigation system completed",
      date: "April 15, 2021",
      author: "Micah McLain",
      content: "We're excited to announce the completion of our new irrigation system that will help small farmers improve crop yields while conserving water resources.",
      imageUrl: "/assets/Logo2.jpg"
    },
    {
      id: 3,
      title: "Spring planting workshop scheduled",
      date: "March 20, 2021",
      author: "Sarah Johnson",
      content: "Join us next month for our annual spring planting workshop where we'll cover essential techniques for successful crop establishment.",
      imageUrl: "/assets/Logo3.png"
    }
];

interface Milestone {
    id: string;
    name: string;
    amount: string;
    isActive: boolean;
    isImplemented: boolean;
  }
  
  interface Expense {
    date: string;
    type: string;
    description: string;
    amount: string;
  }
  
  interface MilestoneTabProps {
    milestones: Milestone[];
    currentMilestone: Milestone;
    objective: string;
    description: string;
    supportText: string;
    whatWeDid: string;
    expenses: Expense[];
    totalExpenses: string;
    images: string[];
  }

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Milestone');

  const [donations, setDonations] = useState<Donation[]>([
    { id: 1, currency: 'BNB', amount: 0.01085, donor: 'anonymous', date: '2025-03-22 12:43:36', message: 'Thanks for your work!' },
    { id: 2, currency: 'USDT', amount: 20, donor: 'anonymous', date: '2025-03-21 00:24:53', message: null },
    { id: 3, currency: 'USDT', amount: 130.6, donor: 'anonymous', date: '2025-03-19 18:13:02', message: null },
    { id: 4, currency: 'BNB', amount: 0.00135, donor: 'anonymous', date: '2025-03-18 23:45:50', message: 'Keep up the good work' },
    { id: 5, currency: 'USDT', amount: 10, donor: 'anonymous', date: '2025-03-18 14:25:53', message: null },
    { id: 6, currency: 'USDT', amount: 10, donor: 'anonymous', date: '2025-03-18 02:54:53', message: null },
    { id: 7, currency: 'BNB', amount: 0.023056, donor: 'anonymous', date: '2025-03-16 03:55:58', message: null },
  ]);

  const allocations: Allocation[] = [
    { id: 1, receiver: 'Turkish Red Crescent', date: '2023-09-26 13:59:01', amount: 61000, currency: 'USDT', useOfFunds: null },
    { id: 2, receiver: 'Turkish Red Crescent', date: '2023-09-08 11:35:55', amount: 1, currency: 'USDT', useOfFunds: null },
    { id: 3, receiver: 'Turkish Red Crescent', date: '2023-02-24 22:31:13', amount: 75000, currency: 'BUSD', useOfFunds: null },
    { id: 4, receiver: 'Mercy Corps', date: '2023-02-22 19:58:18', amount: 75000, currency: 'BUSD', useOfFunds: null },
    { id: 5, receiver: 'Mercy Corps', date: '2023-02-14 21:22:51', amount: 25000, currency: 'BUSD', useOfFunds: null },
    { id: 6, receiver: 'Turkish Red Crescent', date: '2023-02-14 21:18:18', amount: 25000, currency: 'BUSD', useOfFunds: null },
  ];

  const milestones = [
    { id: 'M1', name: 'Milestone 1', amount: 'US$ 4,375', isActive: false, isImplemented: true },
    { id: 'M2', name: 'Milestone 2', amount: 'US$ 4,350', isActive: false, isImplemented: true },
    { id: 'M3', name: 'Milestone 3', amount: 'US$ 1,160', isActive: true, isImplemented: true }
  ];

  const currentMilestone = milestones[2];

  const expenses = [
    {
      date: '04/14/2021',
      type: 'Product',
      description: '4 Silage Tarps, 24 x 105\' - 2 Silage Tarps, 50 x 105\'',
      amount: 'US$ 1,425'
    }
  ];

  useEffect(() => {
    // Simulate fetching project data
    const fetchProjectDetails = () => {
      setLoading(true);
      
      // Mock data based on the image you provided
      setTimeout(() => {
        // This would be replaced with actual API call in a real app
        const mockProject: Project = {
          id: Number(projectId),
          title: 'Earthquake Appeal: Rebuilding & Recovery',
          status: 'Funding',
          subtitle: 'Providing Ongoing Support to People in Turkey & Syria',
          description: 'This project aims to provide ongoing support to communities affected by the devastating earthquakes in Turkey and Syria. Funds will be used for emergency shelter, food, medical aid, and long-term rebuilding efforts.',
          location: 'Turkey & Syria',
          goalAmount: 1003520.25,
          raisedAmount: 455105.84,
          raisedCrypto: '5.39 BTC',
          category: 'Disaster Recovery',
          updatedAt: new Date('2025-03-15'),
          mainImage: Logo,
          allocatedAmount: 441617.29,
          pendingAmount: 13488.55,
          donorsCount: 1610,
          beneficiariesCount: 5000,
          eventDate: new Date('2023-02-06'),
          eventDescription: 'On February 6th 2023, two earthquakes hit the south of Turkey and Syria. At the time of writing more than 46,000 people have been confirmed killed, with the death toll still expected to rise as the search for survivors narrows and the removal of debris continues.\n\nThe first quake of 7.8 magnitude struck at 4.17am with the effects felt as far away as Cairo and Cyprus. This is the most powerful earthquake to have hit the region in the past century. The true extent of the destruction to lives and livelihoods will not be known for quite some time.',
          organizationsInfo: 'We\'ll donate to the government-approved nonprofit Kizilay (the Turkish Red Crescent) and the major humanitarian NGO Mercy Corps in Syria. Funds will be split evenly between the two organizations.',
          lastUpdated: '21 Feb, 2023',
          photoCredit: 'Emin Ozmen for the New York Times',
          socialLinks: {
            twitter: '#',
            facebook: '#',
            telegram: '#',
            ins: '#',
            vk: '#'
          }
        };
        
        setProject(mockProject);
        setLoading(false);
      }, 500);
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  if (loading) {
    return <div className="loading-container">Loading project details...</div>;
  }

  if (!project) {
    return <div className="error-container">Project not found</div>;
  }

  // Calculate donation progress percentage
  const progressPercentage = (project.raisedAmount / project.goalAmount * 100).toFixed(2);
  
  // Determine if project is fully funded
  const isFullyFunded = project.raisedAmount >= project.goalAmount;

  const truncateMessage = (message: string, maxLength: number = 30) => {
    if (!message) return "-";
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <div className="project-details-container">
      {/* Breadcrumb navigation */}
      <div className="breadcrumb">
        <Link to="/">All Projects</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="current-page">{project.title}</span>
      </div>
      
      <div className="project-details-content">
        <div className="project-info-section">
          {/* Project status badge */}
          <div className={`project-status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
            {project.status}
          </div>
          
          {/* Project title and subtitle */}
          <h1 className="project-title">{project.title}</h1>
          <p className="project-subtitle">{project.subtitle}</p>
          
          {/* Funding progress */}
          <div className="funding-details">
            <div className="funding-amounts">
              <span className="raised-amount">${project.raisedAmount.toLocaleString()}</span>
              <span className="of-text">Raised of</span>
              <span className="goal-amount">${project.goalAmount.toLocaleString()}</span>
            </div>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(parseFloat(progressPercentage), 100)}%` }}
                ></div>
              </div>
              <span className="progress-percentage">{progressPercentage}%</span>
            </div>
          </div>
          
          {/* Donation button */}
          <div className="donation-button-container">
            <button 
              className={`donate-button ${isFullyFunded ? 'disabled' : ''}`}
              disabled={isFullyFunded}
            >
              {isFullyFunded ? 'Fully Funded' : 'Donate Now'} 
              {!isFullyFunded && <span className="button-arrow">→</span>}
            </button>
            
            {/* Social sharing */}
            <div className="social-share">
              {project.socialLinks?.twitter && (
                <a href={project.socialLinks.twitter} className="social-icon twitter">
                  <img src="/assets/twitter-logo-black.png" alt="Share on Twitter" />
                </a>
              )}
              {project.socialLinks?.facebook && (
                <a href={project.socialLinks.facebook} className="social-icon facebook">
                  <img src="/assets/facebook-logo-black.png" alt="Share on Facebook" />
                </a>
              )}
              {project.socialLinks?.telegram && (
                <a href={project.socialLinks.telegram} className="social-icon telegram">
                  <img src="/assets/telegram-logo-24.png" alt="Share on Telegram" />
                </a>
              )}
              {project.socialLinks?.ins && (
                <a href={project.socialLinks.ins} className="social-icon instagram">
                  <img src="/assets/instagram-alt-logo-black.png" alt="Share on Instagram" />
                </a>
              )}
              {project.socialLinks?.vk && (
                <a href={project.socialLinks.vk} className="social-icon vk">
                  <img src="/assets/vk-logo-24.png" alt="Share on VK" />
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Project image */}
        <div className="project-image-container">
          <img 
            src={project.mainImage} 
            alt={project.title}
            className="project-main-image"
          />
        </div>
      </div>
      
      {/* Detailed project statistics - Added based on image */}
      <div className="project-statistics">
        <div className="statistics-left">
          <div className="donation-chart">
            <div className="donut-chart-container">
              {/* This would be replaced with an actual chart component */}
              <div className="donut-chart"></div>
            </div>
            <div className="donation-summary">
              <div className="total-raised">
                <h3>Total Raised</h3>
                <div className="crypto-amount">{project.raisedCrypto} ≈ ${project.raisedAmount.toLocaleString()}</div>
                
                <div className="allocation-details">
                  <div className="allocation-item allocated">
                    <div className="allocation-color allocated-color"></div>
                    <span>Total allocated ≈ ${project.allocatedAmount.toLocaleString()}</span>
                  </div>
                  <div className="allocation-item pending">
                    <div className="allocation-color pending-color"></div>
                    <span>Total pending ≈ ${project.pendingAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="project-metrics">
            <div className="metric donors">
              <div className="metric-icon donors-icon"></div>
              <div className="metric-data">
                <div className="metric-value">{project.donorsCount.toLocaleString()}</div>
                <div className="metric-label">Donors</div>
              </div>
            </div>
            <div className="metric beneficiaries">
              <div className="metric-icon beneficiaries-icon"></div>
              <div className="metric-data">
                <div className="metric-value">{project.beneficiariesCount.toLocaleString()}</div>
                <div className="metric-label">End-beneficiaries</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="statistics-right">
          <h2>What happened?</h2>
          <div className="event-description">
            <p>{project.eventDescription}</p>
            
            <p>We've set up this fund so the crypto community can directly support those impacted by the earthquake. As emergency efforts turn to rebuilding and recovery efforts, we're committed to continuing our support.</p>
            
            <p>{project.organizationsInfo}</p>
            
            <p className="update-info">*Page updated {project.lastUpdated}. Cover photo credit to {project.photoCredit}.</p>
          </div>
        </div>
      </div>
      
      {/* Project tabs - Placeholder for future implementation */}
      <div className="project-details-tabs">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'Milestone' ? 'active' : ''}`}
            onClick={() => setActiveTab('Milestone')}
          >
            Progress Milestones
          </button>
          <button 
            className={`tab-button ${activeTab === 'updates' ? 'active' : ''}`}
            onClick={() => setActiveTab('updates')}
          >
            News Updates
          </button>
          <button 
            className={`tab-button ${activeTab === 'donors' ? 'active' : ''}`}
            onClick={() => setActiveTab('donors')}
          >
            Donors
          </button>
          <button 
            className={`tab-button ${activeTab === 'receiver' ? 'active' : ''}`}
            onClick={() => setActiveTab('receiver')}
          >
            Allocations
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'Milestone' && <MilestoneTab
            milestones={milestones}
            currentMilestone={currentMilestone}
            objective="US$ 9,885"
            description="Silage tarps are efficient and cost-effective ways for a farmer to develop healthier soils. Silage tarps can be laid down across land that has been prepared, but not ready to plant so as to help suppress the growth of weeds, or they can be laid across areas where cover crops have been planted to kill off the top vegetation, and allowing decomposition to begin creating a healthier and richer soil structure."
            supportText="Your support will allow us to purchase four silage tarps for use by farmers throughout the region. All donations for this milestone will be used in BTC. We have confirmed with Farmers Friend, the tarps vendor, that we may purchase all equipment directly in bitcoin."
            whatWeDid="Silage Tarps are a simple, cost-effective way to preemptively eliminate weeds by creating a warm, moist environment that quickly kills established weeds and suffocates weed seed germination. They also provide a haven for worms and other beneficial organisms that help decompose organic matter and loosen the soil."
            expenses={expenses}
            totalExpenses="US$ 1,425"
            images={[silageTarpImage]}
        />}
          
          {activeTab === 'updates' && <UpdatesTab newsData={newsData} />}
          
          {activeTab === 'donors' && <DonorTab donations={donations} />}

          {activeTab === 'receiver' && <AllocationsTab allocations={allocations} />}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;