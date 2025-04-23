// Page-ProjectDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot, collection, query, where, Unsubscribe } from 'firebase/firestore';
import { db } from './firebase';
import OverlayDonationFlow from './Overlay-DonationFlow';
import './Page-ProjectDetails.css';

import DonorTab from './Tab-Donors';
import AllocationsTab from './Tab-Allocations';
import UpdatesTab from './Tab-Updates';
import MilestoneTab from './Tab-Milestone';
import { Milestone } from './Tab-Milestone';
import { Donation } from './Tab-Donors';
import { Allocation } from './Tab-Allocations';
import { NewsUpdate } from './Tab-Updates';

import twitterIcon from '/assets/twitter-logo-black.png';
import facebookIcon from '/assets/facebook-logo-black.png';
import telegramIcon from '/assets/telegram-logo-24.png';
import instagramIcon from '/assets/instagram-alt-logo-black.png';
import vkIcon from '/assets/vk-logo-24.png';


interface Project {
  id: string;
  title: string;
  status: 'Funding' | 'Under Implementation' | 'Completed' | 'Cancelled' | string;
  subtitle?: string;
  description: string;
  location: string;
  goalAmount: number;
  raisedAmount: number;
  raisedCrypto?: string;
  category: string;
  updatedAt: Date;
  mainImage: string; // URL string
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
  milestones: Milestone[];
  donations: Donation[];
  allocations: Allocation[];
  newsUpdates: NewsUpdate[];
}

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Milestone');
  const [showDonationOverlay, setShowDonationOverlay] = useState(false);

  // Listen for project document in Firestore.
  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (projectId) {
      const projectRef = doc(db, 'projects', projectId);
      unsubscribe = onSnapshot(
        projectRef,
        (projectSnap) => {
          if (projectSnap.exists()) {
            const data = projectSnap.data();
            const projectData: Project = {
              id: projectSnap.id,
              title: data.title || 'Untitled',
              status: data.status || 'unknown',
              subtitle: data.subtitle,
              description: data.description,
              location: data.location,
              goalAmount: data.goalAmount || 0,
              raisedAmount: data.raisedAmount || 0,
              raisedCrypto: data.raisedCrypto,
              category: data.category || '',
              updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date(),
              mainImage: data.coverImagePreview || data.mainImage || '',
              allocatedAmount: data.allocatedAmount || 0,
              pendingAmount: data.pendingAmount || 0,
              donorsCount: data.donorsCount || 0,
              beneficiariesCount: data.beneficiariesCount !== undefined
                ? Number(data.beneficiariesCount)
                : (data.numberOfBeneficiaries || 0),
              eventDate: data.eventDate ? data.eventDate.toDate() : undefined,
              eventDescription: data.eventDescription,
              organizationsInfo: data.organizationsInfo,
              lastUpdated: data.lastUpdated,
              photoCredit: data.photoCredit,
              socialLinks: {
                twitter: data.socialLinks?.twitter || 'https://www.instagram.com/',
                facebook: data.socialLinks?.facebook || 'https://www.instagram.com/',
                telegram: data.socialLinks?.telegram || 'https://www.instagram.com/',
                ins: data.socialLinks?.ins || 'https://www.instagram.com/',
                vk: data.socialLinks?.vk || 'https://www.instagram.com/',
              },
              milestones: data.milestones || [],
              donations: data.donations || [],
              allocations: data.allocations || [],
              newsUpdates: data.newsUpdates || [],
            };
            setProject(projectData);
          } else {
            setProject(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching project:', error);
          setProject(null);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [projectId]);

  // Listen for donations associated with the project.
  const [donations, setDonations] = useState<Donation[]>([]);
  useEffect(() => {
    let unsubscribeDonations: Unsubscribe;
    if (projectId) {
      const donationsQuery = query(
        collection(db, 'donations'),
        where('projectId', '==', projectId)
      );
      unsubscribeDonations = onSnapshot(
        donationsQuery,
        (querySnapshot) => {
          const donationList: Donation[] = [];
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const isCardDonation = data.fiatAmount && data.fiatCurrency;
            let amount = 0;
            if (isCardDonation) {
              amount = parseFloat(data.fiatAmount);
            } else if (data.cryptoAmount) {
              amount = parseFloat(data.cryptoAmount);
            }
            donationList.push({
              id: docSnap.id,
              donor: data.donor || 'anonymous',
              date:
                data.date && data.date.toDate
                  ? data.date.toDate().toLocaleDateString()
                  : '',
              message: data.message || null,
              amount,
              currency: isCardDonation ? data.fiatCurrency : data.cryptoType || 'Crypto',
              paymentMethod: isCardDonation ? "card" : "crypto",
            });
          });
          setDonations(donationList);
        },
        (error) => {
          console.error("Error retrieving donations:", error);
        }
      );
    }
    return () => {
      if (unsubscribeDonations) unsubscribeDonations();
    };
  }, [projectId]);

  if (loading) {
    return <div className="loading-container">Loading project details...</div>;
  }
  if (!project) {
    return <div className="error-container">Project not found</div>;
  }

  // Calculate progress details safely.
  const displayRaisedAmount = project.raisedAmount || 0;
  const goalAmount = project.goalAmount || 1; // Avoid division by zero.
  const progressPercentage = ((displayRaisedAmount / goalAmount) * 100).toFixed(2);
  const isFullyFunded = displayRaisedAmount >= goalAmount;

  const statusText: string = project.status || 'unknown';
  const statusClass = statusText.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="project-details-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/explore">All Projects</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="current-page">{project.title}</span>
      </div>

      <div className={`project-details-content status-${statusClass}`}>
        <div className="project-info-section">
          <div className={`project-status-badge ${statusClass}`}>
            {project.status}
          </div>
          <h1 className="project-title">{project.title}</h1>
          {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
          <div className="funding-details">
            <div className="funding-amounts">
              <span className="raised-amount">${displayRaisedAmount.toLocaleString()}</span>
              <span className="of-text">Raised of</span>
              <span className="goal-amount">${goalAmount.toLocaleString()}</span>
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
          <div className="donation-button-container">
            <button
              className={`donate-button ${isFullyFunded ? 'disabled' : ''}`}
              disabled={isFullyFunded}
              onClick={() => setShowDonationOverlay(true)}
            >
              {isFullyFunded ? 'Fully Funded' : 'Donate Now'}
              {!isFullyFunded && <span className="button-arrow">→</span>}
            </button>
            {showDonationOverlay && (
              <OverlayDonationFlow
                projectName={project.title}
                projectId={project.id}
                currentRaisedAmount={displayRaisedAmount}
                onClose={() => setShowDonationOverlay(false)}
                onDonationComplete={() => console.log("Donation complete, project updated.")}
              />
            )}
            <div className="social-share">
              {project.socialLinks?.twitter && (
                <a href={project.socialLinks.twitter} className="social-icon twitter">
                  <img src={twitterIcon} alt="Share on Twitter" />
                </a>
              )}
              {project.socialLinks?.facebook && (
                <a href={project.socialLinks.facebook} className="social-icon facebook">
                  <img src={facebookIcon} alt="Share on Facebook" />
                </a>
              )}
              {project.socialLinks?.telegram && (
                <a href={project.socialLinks.telegram} className="social-icon telegram">
                  <img src={telegramIcon} alt="Share on Telegram" />
                </a>
              )}
              {project.socialLinks?.ins && (
                <a href={project.socialLinks.ins} className="social-icon instagram">
                  <img src={instagramIcon} alt="Share on Instagram" />
                </a>
              )}
              {project.socialLinks?.vk && (
                <a href={project.socialLinks.vk} className="social-icon vk">
                  <img src={vkIcon} alt="Share on VK" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="project-image-container">
          {project.mainImage ? (
            <img
              src={project.mainImage}
              alt={project.title}
              className="project-main-image"
            />
          ) : (
            <div className="image-placeholder">No Image Available</div>
          )}
        </div>
      </div>

      <div className="project-statistics">
        <div className="statistics-left">
          <div className="donation-chart">
            <div className="donut-chart-container">
              {/* Optionally integrate a chart component */}
              <div className="donut-chart"></div>
            </div>
            <div className="donation-summary">
              <div className="total-raised">
                <h3>Total Raised</h3>
                <div className="crypto-amount">
                  {project.raisedCrypto ? `${project.raisedCrypto} ≈ ` : ''}${displayRaisedAmount.toLocaleString()}
                </div>
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
                <div className="metric-label">Beneficiaries</div>
              </div>
            </div>
          </div>
        </div>

        <div className="statistics-right">
          <h2>What happened?</h2>
          <div className="event-description">
            <p className="project-description-details">{project.description}</p>
            <p>{project.eventDescription}</p>
            <p>{project.organizationsInfo}</p>
            <p className="update-info">
              *Page updated {project.lastUpdated || 'N/A'}. Cover photo credit to {project.photoCredit || 'Unknown'}.
            </p>
          </div>
        </div>
      </div>

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
          {activeTab === 'Milestone' && (
            <MilestoneTab
              milestones={project.milestones}
              objective={`US$ ${goalAmount.toLocaleString()}`}
              initialMilestoneId={project.milestones?.[0]?.title || ''}
            />
          )}
          {activeTab === 'updates' && <UpdatesTab newsData={project.newsUpdates} />}
          {activeTab === 'donors' && <DonorTab projectId={project.id} />}
          {activeTab === 'receiver' && <AllocationsTab allocations={project.allocations} />}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
