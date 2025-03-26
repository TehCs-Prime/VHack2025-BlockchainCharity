import React, { useEffect, useState } from 'react';
import OverlayDonationFlow from './Overlay-DonationFlow';
import { useParams, Link } from 'react-router-dom';
import './Page-ProjectDetails.css';

import DonorTab from './Tab-Donors';
import AllocationsTab from './Tab-Allocations';
import UpdatesTab from './Tab-Updates';
import MilestoneTab from './Tab-Milestone';

import { Milestone } from './Tab-Milestone';
import { Donation } from './Tab-Donors';
import { Allocation } from './Tab-Allocations';
import { NewsUpdate } from './Tab-Updates';

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
  

  useEffect(() => {
    // Simulate fetching project data
    const fetchProjectDetails = () => {
      setLoading(true);
      
      // Mock data based on the image you provided
      setTimeout(() => {
        // This would be replaced with actual API call in a real app
        const mockProjects: Project[] = [
          {
            id: 1,
            title: 'Clean Water Initiative',
            status: 'Under Implementation',
            subtitle: 'Ensuring safe drinking water for rural communities',
            description: 'Providing clean water access to rural communities',
            location: 'Kenya',
            goalAmount: 500000,
            raisedAmount: 325000,
            raisedCrypto: '2.5 BTC',
            category: 'Water',
            updatedAt: new Date('2025-02-15'),
            mainImage: '/assets/CleanWater.jpeg',
            allocatedAmount: 300000,
            pendingAmount: 25000,
            donorsCount: 750,
            beneficiariesCount: 1500,
            eventDate: new Date('2024-12-01'),
            eventDescription: 'A severe water crisis in Kenya prompted urgent action as communities faced dwindling supplies and rising contamination, leading local governments and humanitarian organizations to collaborate on the rapid construction of new wells and the installation of advanced filtration systems. This swift response was not only aimed at providing immediate relief to affected populations but also at establishing a more resilient infrastructure to mitigate future water shortages. The initiative involved extensive community outreach to educate residents about water conservation practices and maintenance protocols, ensuring that the benefits of these interventions would be sustainable in the long term.',
            organizationsInfo: 'Funds are directed to the Clean Water Trust and local NGOs.',
            lastUpdated: 'Feb 15, 2025',
            photoCredit: 'John Doe Photography',
            socialLinks: {
              twitter: '#',
              facebook: '#',
              telegram: '#',
              ins: '#',
              vk: '#'
            },
            // Project-specific milestone data
            milestones: [
              { 
                id: 'M1', 
                name: 'Water Filters', 
                amount: 'US$ 150,000', 
                isImplemented: true,
                description: "Providing clean water filters to rural communities is essential for ensuring access to safe drinking water, as these filters play a critical role in removing harmful contaminants and pathogens that can lead to waterborne diseases. This intervention not only protects public health by significantly reducing the risk of illness but also supports economic stability by reducing the healthcare burden on families and communities. Moreover, the implementation of these filters fosters greater self-reliance among rural populations, empowering them with the tools and knowledge needed to maintain their water sources and manage water quality effectively. Ultimately, clean water filters contribute to a sustainable development framework, improving overall quality of life while supporting long-term environmental stewardship.",
                supportText: "Your support will allow us to purchase and distribute water filters to communities in need.",
                whatWeDid: "We purchased and distributed 5,000 water filters to families in rural Kenya, providing clean drinking water to approximately 20,000 people.",
                expenses: [
                  {
                    date: '2025-01-10',
                    type: 'Equipment',
                    description: '5,000 water filters',
                    amount: 'US$ 150,000'
                  }
                ],
                totalExpenses: 'US$ 150,000',
                images: ['/assets/WaterFilter.jpeg']
              },
              { 
                id: 'M2', 
                name: 'Well Construction', 
                amount: 'US$ 200,000', 
                isImplemented: true,
                description: "Building walls in communities without access to clean water sources plays a pivotal role in promoting sustainable water access. These walls not only serve as critical barriers that help capture and conserve scarce water resources but also provide protection against floodwaters and contaminants, ensuring that the water retained remains safe for consumption. Additionally, the construction of these walls facilitates the creation of reservoirs and irrigation systems, which can significantly enhance agricultural productivity and overall community resilience. By utilizing local materials and involving community members in the building process, these infrastructural projects foster a strong sense of ownership and empowerment, ultimately contributing to the long-term self-sufficiency and improved quality of life for the communities involved.",
                supportText: "Your support will help us construct wells in communities where water sources are scarce or contaminated.",
                whatWeDid: "We constructed 15 community wells, providing reliable access to clean water for approximately 7,500 people.",
                expenses: [
                  {
                    date: '2025-02-05',
                    type: 'Construction',
                    description: '15 community walls',
                    amount: 'US$ 200,000'
                  }
                ],
                totalExpenses: 'US$ 200,000',
                images: ['/assets/WallConstruction.jpeg']
              },
              { 
                id: 'M3', 
                name: 'Water Education', 
                amount: 'US$ 150,000', 
                isImplemented: false,
                description: "Education on water sanitation and hygiene is essential for maximizing the health benefits of clean water by empowering communities with the knowledge and skills needed to effectively manage water resources. Through targeted training and outreach programs, individuals learn not only about proper water storage and handling practices but also about the importance of personal and community hygiene in preventing waterborne diseases. This educational approach fosters a culture of proactive health management, enabling communities to implement sustainable practices that reduce contamination risks and promote long-term well-being. Moreover, when communities are informed about the science behind water treatment and sanitation, they become active participants in maintaining infrastructure and advocating for improved water quality, thereby ensuring that the provision of clean water translates into tangible public health benefits.",
                supportText: "Your support will help us develop and implement water education programs in communities.",
                whatWeDid: "This milestone is not yet implemented.",
                expenses: [
                  {
                    date: '2025-03-15',
                    type: 'Education',
                    description: 'Communities education on clean water applications',
                    amount: 'US$ 150,000'
                  }
                ],
                totalExpenses: 'US$ 150,000',
                images: ['/assets/WaterEdu.jpeg']
              }
            ],
            // Project-specific donations
            donations: [
              { id: 1, currency: 'BNB', amount: 0.25, donor: 'anonymous', date: '2025-02-10 12:43:36', message: 'Clean water for everyone!' },
              { id: 2, currency: 'USDT', amount: 50000, donor: 'anonymous', date: '2025-02-05 08:15:22', message: null },
              { id: 3, currency: 'BNB', amount: 0.15, donor: 'anonymous', date: '2025-01-28 16:30:45', message: 'Hope this helps!' },
              { id: 4, currency: 'USDT', amount: 25000, donor: 'anonymous', date: '2025-01-20 09:22:10', message: null },
              { id: 5, currency: 'BNB', amount: 0.1, donor: 'anonymous', date: '2025-01-15 14:05:38', message: 'Keep up the good work' },
            ],
            // Project-specific allocations
            allocations: [
              { id: 1, receiver: 'Water Relief Organization', date: '2025-02-15 13:59:01', amount: 75000, currency: 'USDT', useOfFunds: 'Water filters' },
              { id: 2, receiver: 'Community Well Builders', date: '2025-02-10 11:35:55', amount: 150000, currency: 'BNB', useOfFunds: 'Well construction' },
              { id: 3, receiver: 'Clean Water Trust', date: '2025-01-25 22:31:13', amount: 75000, currency: 'USDT', useOfFunds: 'Filter distribution' },
            ],
            // Project-specific news updates
            newsUpdates: [
              {
                id: 1,
                title: "Initial water filter distribution completed",
                date: "Jan 15, 2025",
                author: "John Smith",
                content: "We've successfully distributed the first batch of water filters to 2,000 families across five villages. Local community members have been trained on proper usage and maintenance. Initial feedback has been overwhelmingly positive with reports of reduced waterborne illnesses.",
                imageUrl: "/assets/water-filter-distribution.jpeg"
              },
              {
                id: 2,
                title: "Well construction completed in priority communities",
                date: "Feb 10, 2025",
                author: "Sarah Johnson",
                content: "All 15 planned community wells have now been completed ahead of schedule. These wells are already providing reliable access to clean water for over 7,500 people who previously had to travel more than 5 miles daily for water. Local maintenance committees have been established to ensure long-term sustainability.",
                imageUrl: "/assets/completed-wells.jpeg"
              },
              {
                id: 3,
                title: "Water education program development begins",
                date: "Feb 20, 2025",
                author: "Michael Brown",
                content: "With the infrastructure components of our project successfully implemented, we've begun developing our water education curriculum in partnership with local educators. This program will teach proper water handling, storage, and hygiene practices. We've allocated initial funds to create educational materials and train local facilitators, though full implementation awaits additional funding.",
                imageUrl: "/assets/water-education.jpeg"
              }
            ]
          },
            {
              id: 2,
              title: 'Education for All',
              status: 'Funding',
              subtitle: 'Building schools in underserved areas',
              description: 'Providing access to quality education for children in rural India.',
              location: 'India',
              goalAmount: 750000,
              raisedAmount: 225000,
              raisedCrypto: '1.8 ETH',
              category: 'Education',
              updatedAt: new Date('2025-03-01'),
              mainImage: '/assets/Edu.jpeg',
              allocatedAmount: 180000,
              pendingAmount: 45000,
              donorsCount: 500,
              beneficiariesCount: 1200,
              eventDate: new Date('2024-11-15'),
              eventDescription: 'Initiating school construction in remote villages is a pivotal step toward ensuring that every child has access to quality education, regardless of geographic location. This endeavor not only creates safe and dedicated learning environments but also serves as a foundation for broader community development by bridging educational gaps and fostering opportunities for social and economic advancement. With well-equipped facilities and trained educators, these schools can nurture young minds, instilling essential skills and knowledge that empower future generations to contribute meaningfully to their communities. Additionally, the presence of a local school encourages community engagement, promotes gender equality, and strengthens the overall resilience of the village, ultimately paving the way for sustainable development and improved quality of life for all residents.',
              organizationsInfo: 'Managed by the Global Education Fund and local education bodies.',
              lastUpdated: 'Mar 01, 2025',
              photoCredit: 'Jane Doe Photography',
              socialLinks: {
                  twitter: '#',
                  facebook: '#',
                  telegram: '#',
                  ins: '#',
                  vk: '#'
              },
              milestones: [
                  {
                      id: 'M1',
                      name: 'Classroom Construction',
                      amount: 'US$ 250,000',
                      isImplemented: true,
                      description: "Building new classrooms to accommodate more students is a crucial initiative that not only addresses overcrowding issues in existing educational facilities but also paves the way for enhanced learning experiences and academic success. This expansion effort ensures that every child has sufficient space to engage in interactive learning and benefit from personalized attention from educators, which is vital for their cognitive and social development. With increased capacity, schools can offer a broader range of extracurricular activities, improved resources, and specialized programs tailored to diverse student needs, thereby fostering a more inclusive and dynamic educational environment. Additionally, this project demonstrates a strong commitment to investing in the future of the community by providing a stable, supportive foundation for lifelong learning and growth.",
                      supportText: "Your support will help us construct classrooms with proper infrastructure.",
                      whatWeDid: "Constructed 10 classrooms, each equipped with modern learning tools.",
                      expenses: [
                          {
                              date: '2025-02-10',
                              type: 'Construction',
                              description: 'Building materials and labor',
                              amount: 'US$ 250,000'
                          }
                      ],
                      totalExpenses: 'US$ 250,000',
                      images: ['/assets/classroom-construction.jpeg']
                  },
                  {
                      id: 'M2',
                      name: 'Teacher Training Program',
                      amount: 'US$ 100,000',
                      isImplemented: false,
                      description: "Training local educators to improve teaching quality is a vital investment in the future of education, as it equips teachers with modern pedagogical techniques, subject expertise, and effective classroom management skills. By enhancing these competencies, educators can create more engaging and inclusive learning environments that meet diverse student needs and encourage critical thinking. Continuous professional development also fosters a collaborative culture among teachers, leading to the sharing of best practices and innovative teaching strategies that ultimately contribute to improved student outcomes. Moreover, when local educators receive quality training, it not only elevates the standard of instruction but also strengthens community trust in the educational system, paving the way for a more resilient and empowered future generation.",
                      supportText: "Your donation will help provide teachers with the necessary training and resources.",
                      whatWeDid: "Training sessions are planned but not yet implemented.",
                      expenses: [],
                      totalExpenses: 'US$ 0',
                      images: ['/assets/TeacherTrainingProgram.jpeg']
                  }
              ],
              donations: [
                  { id: 1, currency: 'BNB', amount: 0.5, donor: 'anonymous', date: '2025-02-25 10:30:00', message: 'Education changes lives!' },
                  { id: 2, currency: 'USDT', amount: 50000, donor: 'anonymous', date: '2025-02-20 14:10:45', message: null },
                  { id: 3, currency: 'BNB', amount: 0.3, donor: 'anonymous', date: '2025-02-15 09:45:22', message: 'A better future for all' }
              ],
              allocations: [
                  { id: 1, receiver: 'Education Support Foundation', date: '2025-02-28 12:00:00', amount: 90000, currency: 'USDT', useOfFunds: 'Classroom construction' },
                  { id: 2, receiver: 'Teacher Training Program', date: '2025-02-22 15:30:00', amount: 90000, currency: 'BNB', useOfFunds: 'Educator development' }
              ],
              newsUpdates: [
                  {
                      id: 1,
                      title: "New school buildings completed!",
                      date: "Mar 05, 2025",
                      author: "Emily Johnson",
                      content: "We've successfully completed the construction of 10 new classrooms, improving learning conditions for 500 students.",
                      imageUrl: "/assets/new-school.jpeg"
                  },
                  {
                      id: 2,
                      title: "Teacher training initiative announced",
                      date: "Feb 20, 2025",
                      author: "David Lee",
                      content: "We're excited to launch a training program for teachers to enhance the quality of education in remote areas.",
                      imageUrl: "/assets/teacher-training.jpeg"
                  }
              ]
          },
          {
            id: 3,
            title: 'Wildlife Conservation',
            status: 'Completed',
            subtitle: 'Protecting endangered species in the Amazon',
            description: 'A dedicated initiative to preserve biodiversity in the Amazon rainforest by restoring habitats and protecting endangered species.',
            location: 'Brazil',
            goalAmount: 1000000,
            raisedAmount: 1000000,
            raisedCrypto: '3.2 BTC',
            category: 'Animals',
            updatedAt: new Date('2025-01-20'),
            mainImage: '/assets/wildlife-conservation.jpeg',
            allocatedAmount: 800000,
            pendingAmount: 200000,
            donorsCount: 1200,
            beneficiariesCount: 3000,
            eventDate: new Date('2025-01-10'),
            eventDescription: 'A comprehensive wildlife survey was completed to gain critical insights into species populations and ecosystem health, laying the foundation for targeted conservation strategies. Building on these findings, habitat restoration projects were initiated in key conservation areas to revitalize degraded ecosystems and support biodiversity. These projects focus on reforestation, the removal of invasive species, and the restoration of natural water sources, aiming to reestablish the natural balance essential for sustaining wildlife populations. By integrating scientific research with on-the-ground restoration efforts, this initiative not only enhances habitat quality but also fosters community engagement and promotes long-term ecological resilience in these vital regions.',
            organizationsInfo: 'In partnership with Brazilian conservation agencies and global wildlife foundations.',
            lastUpdated: 'Jan 20, 2025',
            photoCredit: 'Wildlife Photography Inc',
            socialLinks: {
              twitter: 'https://twitter.com/wildlife_conserve',
              facebook: 'https://facebook.com/wildlifeconservation',
              telegram: '#',
              ins: 'https://instagram.com/wildlifeconserve',
              vk: '#'
            },
            milestones: [
              {
                id: 'M1',
                name: 'Habitat Restoration',
                amount: 'US$ 400,000',
                isImplemented: true,
                description: 'Reforestation and restoration of degraded areas are pivotal strategies in improving habitat quality by reintroducing native vegetation, stabilizing soil, and fostering biodiversity. This comprehensive approach involves planting indigenous trees and shrubs, rehabilitating water sources, and removing invasive species, all of which contribute to the recovery of ecosystems that have been diminished by human activity or natural disasters. By restoring these environments, not only is wildlife provided with safer and more nutritious habitats, but local communities also benefit from improved air quality, enhanced water retention, and potential economic opportunities through eco-tourism and sustainable land management practices.',
                supportText: 'Support our efforts to plant native trees and restore vital ecosystems.',
                whatWeDid: 'Planted over 200,000 native trees and restored multiple hectares of forest land.',
                expenses: [
                  {
                    date: '2025-01-05',
                    type: 'Reforestation',
                    description: 'Procurement of saplings and planting labor',
                    amount: 'US$ 400,000'
                  }
                ],
                totalExpenses: 'US$ 400,000',
                images: ['/assets/habitat-restoration.jpeg', '/assets/forest-replanting.jpeg']
              },
              {
                id: 'M2',
                name: 'Animal Protection',
                amount: 'US$ 300,000',
                isImplemented: true,
                description: 'Initiatives to safeguard endangered species have been intensified through the implementation of robust anti-poaching measures and comprehensive reserve management strategies. These efforts include the deployment of advanced surveillance technologies, such as drones and camera traps, to monitor wildlife populations and detect illegal activities in real time. Enhanced patrolling by well-trained rangers, combined with community engagement programs, ensures that local residents are actively involved in conservation efforts and are equipped to report suspicious activities. In addition, the management of protected reserves has been refined to balance strict enforcement with sustainable tourism and research opportunities, thereby fostering both the preservation of critical habitats and the long-term ecological stability necessary for the survival of endangered species.',
                supportText: 'Your donation helps fund patrol teams and conservation technology.',
                whatWeDid: 'Established anti-poaching units and increased surveillance in critical habitats.',
                expenses: [
                  {
                    date: '2025-01-12',
                    type: 'Security',
                    description: 'Deployment of surveillance equipment and training for patrol teams',
                    amount: 'US$ 300,000'
                  }
                ],
                totalExpenses: 'US$ 300,000',
                images: ['/assets/anti-poaching.jpeg']
              },
              {
                id: 'M3',
                name: 'Research & Monitoring',
                amount: 'US$ 300,000',
                isImplemented: false,
                description: 'Ongoing research to monitor species populations and ecosystem health is a cornerstone of effective conservation and environmental management. Through regular surveys, advanced remote sensing technologies, and community-based observations, scientists gather critical data that reveals trends in biodiversity, habitat changes, and the impacts of human activities. This information not only guides adaptive management strategies and informs policy decisions but also helps identify emerging threats, such as invasive species or climate change-related stressors, allowing for proactive interventions. In essence, sustained research efforts ensure that conservation initiatives remain evidence-based, targeted, and resilient, ultimately supporting the long-term vitality of both natural ecosystems and the communities that depend on them.',
                supportText: 'Help us set up long-term monitoring stations and research programs.',
                whatWeDid: 'Initial planning and pilot studies conducted, full implementation pending further funding.',
                expenses: [],
                totalExpenses: 'US$ 0',
                images: ['/assets/research.jpeg']
              }
            ],
            donations: [
              { id: 1, currency: 'BNB', amount: 0.5, donor: 'nature_lover', date: '2025-01-18 11:25:00', message: 'For a thriving Amazon!' },
              { id: 2, currency: 'USDT', amount: 75000, donor: 'ecoSupporter', date: '2025-01-15 09:40:22', message: null },
              { id: 3, currency: 'BNB', amount: 0.3, donor: 'wildlifeFan', date: '2025-01-10 16:05:45', message: 'Conservation is key!' }
            ],
            allocations: [
              { id: 1, receiver: 'Amazonian Conservation Trust', date: '2025-01-20 14:10:00', amount: 400000, currency: 'USDT', useOfFunds: 'Habitat restoration' },
              { id: 2, receiver: 'Wildlife Protection Agency', date: '2025-01-18 10:55:00', amount: 300000, currency: 'BNB', useOfFunds: 'Animal protection initiatives' }
            ],
            newsUpdates: [
              {
                id: 1,
                title: 'Habitat Restoration Milestone Achieved',
                date: 'Jan 22, 2025',
                author: 'Laura Green',
                content: 'Our team has successfully planted over 200,000 trees in critical zones of the Amazon, marking a significant step towards restoring natural habitats.',
                imageUrl: '/assets/habitat-news.jpeg'
              },
              {
                id: 2,
                title: 'New Anti-Poaching Measures Implemented',
                date: 'Jan 18, 2025',
                author: 'Carlos Silva',
                content: 'Anti-poaching units have been deployed in several high-risk areas, dramatically improving the protection of endangered species in the region.',
                imageUrl: '/assets/anti-poaching-news.jpeg'
              }
            ]
          },
          {
            id: 4,
            title: 'Disaster Relief Program',
            status: 'Cancelled',
            subtitle: 'Emergency response and recovery for disaster-stricken regions',
            description: 'A vital initiative designed to provide immediate relief and recovery efforts after natural disasters in the Philippines. Although the project was ultimately cancelled, it provided essential insights for future emergency preparedness.',
            location: 'Philippines',
            goalAmount: 600000,
            raisedAmount: 50000,
            raisedCrypto: '0.8 BTC',
            category: 'Disaster Recovery',
            updatedAt: new Date('2025-03-10'),
            mainImage: '/assets/disaster-relief.jpeg',
            allocatedAmount: 30000,
            pendingAmount: 20000,
            donorsCount: 300,
            beneficiariesCount: 800,
            eventDate: new Date('2025-02-28'),
            eventDescription: 'Rapid response measures were initially devised following recent typhoon warnings to safeguard vulnerable communities with emergency shelters, supplies, and evacuation plans. However, unforeseen complications—including logistical challenges, resource constraints, and coordination issues among the agencies involved—led to the project\'s cancellation before it could be fully implemented. This cancellation has underscored the need for more robust contingency planning and interagency collaboration to better prepare for future natural disasters.',
            organizationsInfo: 'In collaboration with local disaster response teams and international NGOs, the initial assessment was successfully conducted.',
            lastUpdated: 'Mar 10, 2025',
            photoCredit: 'Disaster Relief Photo Agency',
            socialLinks: {
              twitter: '#',
              facebook: '#',
              telegram: '#',
              ins: '#',
              vk: '#'
            },
            milestones: [
              {
                id: 'M1',
                name: 'Initial Assessment & Planning',
                amount: 'US$ 100,000',
                isImplemented: true,
                description: 'A rapid assessment of the disaster impact was conducted to gauge the immediate needs of affected communities and understand the extent of infrastructural damage. This assessment provided critical data on the scale of the disruption, guiding relief agencies to prioritize interventions effectively. Based on the findings, an initial relief plan was devised, outlining key actions such as the deployment of emergency response teams, distribution of essential supplies, and temporary shelter arrangements. This plan serves as a foundation for subsequent recovery efforts, ensuring that resources are allocated efficiently to support those most in need during the critical aftermath of the disaster.',
                supportText: 'Your support enabled us to deploy assessment teams and evaluate on-ground conditions.',
                whatWeDid: 'Assessment teams were deployed, and a detailed relief plan was drafted; however, subsequent complications led to the project’s cancellation.',
                expenses: [
                  {
                    date: '2025-02-20',
                    type: 'Logistics',
                    description: 'Deployment of assessment team and initial site evaluation',
                    amount: 'US$ 100,000'
                  }
                ],
                totalExpenses: 'US$ 100,000',
                images: ['/assets/disaster-assessment.jpeg']
              },
              {
                id: 'M2',
                name: 'Resource Mobilization',
                amount: 'US$ 150,000',
                isImplemented: false,
                description: 'Planning for the mobilization of resources and partnerships for emergency relief efforts is a critical preparatory step that ensures a swift and coordinated response when crises occur. This strategic process involves identifying key needs, mapping available resources, and forging collaborations among governmental agencies, non-governmental organizations, private sector partners, and local communities. By establishing clear communication channels and coordinated action plans, stakeholders can rapidly allocate essential supplies, personnel, and financial support to affected areas. Moreover, this proactive approach not only minimizes response times during emergencies but also strengthens overall community resilience, ensuring that relief efforts are both effective and sustainable in the long term.',
                supportText: 'Your donation would have helped set up rapid response resource channels.',
                whatWeDid: 'Initial planning was initiated but was not executed due to project cancellation.',
                expenses: [],
                totalExpenses: 'US$ 0',
                images: ['/assets/Resource Mobilization.jpeg']
              }
            ],
            donations: [
              { id: 1, currency: 'BNB', amount: 0.2, donor: 'supporterX', date: '2025-02-25 14:20:00', message: 'We stand with disaster victims!' },
              { id: 2, currency: 'USDT', amount: 15000, donor: 'donorY', date: '2025-02-23 11:00:00', message: null }
            ],
            allocations: [
              { id: 1, receiver: 'Local Relief Agency', date: '2025-03-05 10:30:00', amount: 30000, currency: 'USDT', useOfFunds: 'Initial relief logistics and assessment follow-up' }
            ],
            newsUpdates: [
              {
                id: 1,
                title: 'Initial Assessment Completed',
                date: 'Feb 22, 2025',
                author: 'Maria Santos',
                content: 'Our team successfully completed an initial assessment in the affected areas. Early signs were promising, but logistical challenges soon emerged.',
                imageUrl: '/assets/disaster-assessment-news.jpeg'
              },
              {
                id: 2,
                title: 'Project Cancellation Announcement',
                date: 'Mar 10, 2025',
                author: 'James Reyes',
                content: 'Due to unforeseen logistical and funding challenges, the Disaster Relief Program has been officially cancelled. We extend our gratitude to all donors and partners for their support.',
                imageUrl: '/assets/cancellation-news.jpeg'
              }
            ]
          }          
        ];
        
        if (projectId) {
          const foundProject = mockProjects.find(p => p.id === parseInt(projectId));
          
          if (foundProject) {
            setProject(foundProject);
          }
        }
        setLoading(false);
      }, 500);
    };

    // Only call fetchProjectDetails if projectId exists
    if (projectId) {
      fetchProjectDetails();
    } else {
      setLoading(false); // No projectId, so no need to keep loading
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

  return (
    <div className="project-details-container">
      {/* Breadcrumb navigation */}
      <div className="breadcrumb">
        <Link to="/explore">All Projects</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="current-page">{project.title}</span>
      </div>
      
      <div className={`project-details-content status-${project?.status?.toLowerCase().replace(' ', '-')}`}>
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
              onClick={() => setShowDonationOverlay(true)}
            >
              {isFullyFunded ? 'Fully Funded' : 'Donate Now'}
              {!isFullyFunded && <span className="button-arrow">→</span>}
            </button>

            {showDonationOverlay && (
              <OverlayDonationFlow
                projectName={project?.title}
                onClose={() => setShowDonationOverlay(false)}
                  // TODO: Integrate with blockchain donation logic
                
              />
            )}
            
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
          milestones={project.milestones}
          objective={`US$ ${project.goalAmount.toLocaleString()}`}
          initialMilestoneId={(project.milestones && project.milestones.length > 0) ? project.milestones[0].id : ''}
          />}

        {activeTab === 'updates' && <UpdatesTab newsData={project.newsUpdates} />}

        {activeTab === 'donors' && <DonorTab donations={project.donations} />}

        {activeTab === 'receiver' && <AllocationsTab allocations={project.allocations} />}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;