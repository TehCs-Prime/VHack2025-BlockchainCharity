// ProjectDiscovery.tsx
import "./Page-Explore.css";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase'; // your firebase configuration file
import { useAuth } from './AuthContext'; // custom hook returning current user info

// Define types for our filters
type ProjectStatus = 'All' | 'Funding' | 'Under Implementation' | 'Completed' | 'Cancelled';
type Timing = 'All' | 'Near to End' | 'New Project';
type Category = 'All' | 'Animals' | 'Children' | 'Climate Change' | 'Disaster Recovery' | 
               'Economic Development' | 'Education' | 'Health' | 'Human Rights' | 
               'Humanitarian Assistance' | 'Hunger' | 'Microfinance' | 'Water';

interface ProjectFilters {
  status: ProjectStatus[];
  timing: Timing[];
  categories: Category[];
  location: string;
}

// Project interface matching Firestore document structure.
export interface Project {
  id?: string;  // Firestore document ID
  title: string;
  status: Exclude<ProjectStatus, 'All'>;
  subtitle?: string;
  timing?: Exclude<Timing, 'All'>;
  description: string;
  location: string;
  goalAmount: number;
  raisedAmount: number;
  raisedCrypto?: string;
  category: Exclude<Category, 'All'>;
  updatedAt: Date;
  mainImage: string; // Expected to be a fully-qualified URL (e.g. from imgbb)
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
  // Additional arrays (e.g. milestones, donations, allocations, newsUpdates) can be added.
}

export const ProjectDiscovery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Last updated');
  const [viewMode, setViewMode] = useState('Grid');
  const [filters, setFilters] = useState<ProjectFilters>({
    status: ['All'],
    timing: ['All'],
    categories: ['All'],
    location: '',
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState<Project>({
    title: '',
    status: 'Funding',
    description: '',
    location: '',
    goalAmount: 0,
    raisedAmount: 0,
    category: 'Water',
    updatedAt: new Date(),
    mainImage: '',
    allocatedAmount: 0,
    pendingAmount: 0,
    donorsCount: 0,
    beneficiariesCount: 0,
  });
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  const navigateToProjectDetails = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  // Fetch projects from Firestore. Parse Firestore timestamps into Date objects if they exist.
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData: Project[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();

        projectsData.push({
          id: doc.id,
          title: data.title,
          status: data.status,
          subtitle: data.subtitle,
          timing: data.timing,
          description: data.subtitle,
          location: data.location,
          goalAmount: data.goalAmount,
          raisedAmount: data.raisedAmount,
          raisedCrypto: data.raisedCrypto,
          category: data.category,
          // Use the updatedAt field if available, or default to current date
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date(),
          mainImage: data.mainImage,
          allocatedAmount: data.allocatedAmount,
          pendingAmount: data.pendingAmount,
          donorsCount: data.donorsCount,
          beneficiariesCount: data.beneficiariesCount,
          eventDate: data.eventDate ? data.eventDate.toDate() : undefined,
          eventDescription: data.eventDescription,
          organizationsInfo: data.organizationsInfo,
          lastUpdated: data.lastUpdated,
          photoCredit: data.photoCredit,
          socialLinks: data.socialLinks,
        });
      });
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter checkbox change handler.
  const handleCheckboxChange = (
    section: 'status' | 'timing' | 'categories',
    value: ProjectStatus | Timing | Category
  ) => {
    setFilters(prev => {
      const currentValues = [...prev[section]];
      if (value === 'All') {
        if (currentValues.includes('All')) {
          return prev;
        }
        return { ...prev, [section]: ['All'] };
      }
      const newValues = currentValues.filter(v => v !== 'All');
      const valueIndex = newValues.indexOf(value as never);
      if (valueIndex !== -1) {
        newValues.splice(valueIndex, 1);
        if (newValues.length === 0) {
          return { ...prev, [section]: ['All'] };
        }
      } else {
        newValues.push(value as never);
      }
      return { ...prev, [section]: newValues };
    });
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, location: e.target.value }));
  };

  const clearAllFilters = () => {
    setFilters({
      status: ['All'],
      timing: ['All'],
      categories: ['All'],
      location: '',
    });
    setSearchQuery('');
  };

  // Filter and sort projects based on criteria.
  const getFilteredAndSortedProjects = (): Project[] => {
    let filteredProjects = [...projects];
    if (!filters.status.includes('All')) {
      filteredProjects = filteredProjects.filter(project => filters.status.includes(project.status));
    }
    if (!filters.timing.includes('All')) {
      filteredProjects = filteredProjects.filter(project =>
        project.timing ? filters.timing.includes(project.timing) : true
      );
    }
    if (!filters.categories.includes('All')) {
      filteredProjects = filteredProjects.filter(project => filters.categories.includes(project.category));
    }
    if (filters.location.trim() !== '') {
      const locationLower = filters.location.toLowerCase().trim();
      filteredProjects = filteredProjects.filter(project =>
        project.location.toLowerCase().includes(locationLower)
      );
    }
    if (searchQuery.trim() !== '') {
      const searchLower = searchQuery.toLowerCase().trim();
      filteredProjects = filteredProjects.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.category.toLowerCase().includes(searchLower) ||
        project.location.toLowerCase().includes(searchLower)
      );
    }
    filteredProjects.sort((a, b) => {
      switch (sortBy) {
        case 'Name':
          return a.title.localeCompare(b.title);
        case 'Date created':
          return (a.id && b.id) ? a.id.localeCompare(b.id) : 0;
        case 'Last updated':
        default:
          return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });
    return filteredProjects;
  };

  // --- IMGBB Image Upload ---  
  // This function is used when an admin adds a new project.
  const uploadImageToImgbb = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    // Replace with your actual imgbb API key.
    formData.append('key', 'ea041d81863434cecbdb34bfe3264458');
    
    const res = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    }
    throw new Error('Image upload failed');
  };

  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingImage(true);
      try {
        const imageUrl = await uploadImageToImgbb(e.target.files[0]);
        setNewProject(prev => ({ ...prev, mainImage: imageUrl }));
      } catch (err) {
        console.error(err);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Admin add-project handler.
  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!newProject.mainImage) {
        alert('Please upload an image');
        return;
      }
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        updatedAt: serverTimestamp(),
      });
      setShowAddForm(false);
      setNewProject({
        title: '',
        status: 'Funding',
        description: '',
        location: '',
        goalAmount: 0,
        raisedAmount: 0,
        category: 'Water',
        updatedAt: new Date(),
        mainImage: '',
        allocatedAmount: 0,
        pendingAmount: 0,
        donorsCount: 0,
        beneficiariesCount: 0,
      });
      fetchProjects();
    } catch (error) {
      console.error("Error adding project: ", error);
    }
  };

  // Render the admin add-project form.
  const renderAddProjectForm = () => (
    <div className="add-project-form-container">
      <form className="add-project-form" onSubmit={handleAddProject}>
        <h2>Add New Project</h2>
        <label>Title:</label>
        <input 
          type="text" 
          value={newProject.title} 
          onChange={e => setNewProject({ ...newProject, title: e.target.value })} 
          required
        />
        <label>Status:</label>
        <select 
          value={newProject.status} 
          onChange={e => setNewProject({ ...newProject, status: e.target.value as Exclude<ProjectStatus, 'All'> })}
        >
          <option value="Funding">Funding</option>
          <option value="Under Implementation">Under Implementation</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <label>Description:</label>
        <textarea 
          value={newProject.description} 
          onChange={e => setNewProject({ ...newProject, description: e.target.value })}
          required 
        />
        <label>Location:</label>
        <input 
          type="text" 
          value={newProject.location} 
          onChange={e => setNewProject({ ...newProject, location: e.target.value })}
          required
        />
        <label>Goal Amount:</label>
        <input 
          type="number" 
          value={newProject.goalAmount} 
          onChange={e => setNewProject({ ...newProject, goalAmount: +e.target.value })}
        />
        <label>Raised Amount:</label>
        <input 
          type="number" 
          value={newProject.raisedAmount} 
          onChange={e => setNewProject({ ...newProject, raisedAmount: +e.target.value })}
        />
        <label>Category:</label>
        <select 
          value={newProject.category} 
          onChange={e => setNewProject({ ...newProject, category: e.target.value as Exclude<Category, 'All'> })}
        >
          <option value="Water">Water</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          {/* Add other categories as needed */}
        </select>
        <label>Image Upload (via imgbb):</label>
        <input type="file" onChange={handleImageFileChange} />
        {uploadingImage && <p>Uploading image...</p>}
        {newProject.mainImage && (
          <img src={newProject.mainImage} alt="Uploaded" className="uploaded-preview" />
        )}
        <div className="form-buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="project-discovery-container">
      <div className="page-title-container">
        <h1 className="page-title">Discover All Projects</h1>
      </div>

      {/* Admin Toolbar */}
      {userData?.role === 'admin' && (
        <div className="admin-toolbar">
          <button className="add-project-btn" onClick={() => setShowAddForm(true)}>
            Add Project
          </button>
        </div>
      )}
      
      <div className="content-layout">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <div className="filters-header">
            <h2>Filters</h2>
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              Clear All
            </button>
          </div>
          <div className="filter-section">
            <h3>Project Status</h3>
            {(['All', 'Funding', 'Under Implementation', 'Completed', 'Cancelled'] as const).map(status => (
              <div className="filter-option" key={status}>
                <input
                  type="checkbox"
                  id={`status-${status}`}
                  checked={filters.status.includes(status)}
                  onChange={() => handleCheckboxChange('status', status)}
                />
                <label htmlFor={`status-${status}`}>{status}</label>
              </div>
            ))}
          </div>
          <div className="filter-section">
            <h3>Timing</h3>
            {(['All', 'Near to End', 'New Project'] as const).map(timing => (
              <div className="filter-option" key={timing}>
                <input
                  type="checkbox"
                  id={`timing-${timing}`}
                  checked={filters.timing.includes(timing)}
                  onChange={() => handleCheckboxChange('timing', timing)}
                />
                <label htmlFor={`timing-${timing}`}>{timing}</label>
              </div>
            ))}
          </div>
          <div className="filter-section categories-section">
            <h3>Categories</h3>
            <div className="scrollable-categories">
              {(['All', 'Animals', 'Children', 'Climate Change', 'Disaster Recovery', 
                'Economic Development', 'Education', 'Health', 'Human Rights', 
                'Humanitarian Assistance', 'Hunger', 'Microfinance', 'Water'] as const).map(category => (
                <div className="filter-option" key={category}>
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCheckboxChange('categories', category)}
                  />
                  <label htmlFor={`category-${category}`}>{category}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <h3>By Location</h3>
            <div className="location-input">
              <input
                type="text"
                placeholder="Enter a city, state or country"
                value={filters.location}
                onChange={handleLocationChange}
              />
              {filters.location && (
                <button 
                  className="clear-location-btn"
                  onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="active-filters">
            <h3>Active Filters</h3>
            <div className="active-filters-list">
              {filters.status.includes('All') && filters.timing.includes('All') && 
               filters.categories.includes('All') && !filters.location ? (
                <span className="no-filters">No active filters</span>
              ) : (
                <>
                  {!filters.status.includes('All') && (
                    <div className="filter-tag">
                      Status: {filters.status.join(', ')}
                    </div>
                  )}
                  {!filters.timing.includes('All') && (
                    <div className="filter-tag">
                      Timing: {filters.timing.join(', ')}
                    </div>
                  )}
                  {!filters.categories.includes('All') && (
                    <div className="filter-tag">
                      Categories: {filters.categories.join(', ')}
                    </div>
                  )}
                  {filters.location && (
                    <div className="filter-tag">
                      Location: {filters.location}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="projects-content">
          <div className="search-and-controls">
            <div className="search-bar">
              <img className="search-icon" src="/assets/SearchIcon.png" alt="Search" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </button>
              )}
            </div>
            <div className="sort-controls">
              <div className="sort-dropdown">
                <label htmlFor="sort-select">Sort by:</label>
                <select 
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option className="py-2" value="Last updated">Last updated</option>
                  <option value="Name">Name</option>
                  <option value="Date created">Date created</option>
                </select>
              </div>
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'Grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('Grid')}
                >
                  Grid
                </button>
                <button 
                  className={`view-btn ${viewMode === 'List' ? 'active' : ''}`}
                  onClick={() => setViewMode('List')}
                >
                  List
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <p>Loading projects...</p>
          ) : (
            <div className={`projects-container ${viewMode.toLowerCase()}-view`}>
              {getFilteredAndSortedProjects().map(project => (
                <div 
                  key={project.id} 
                  className="project-card" 
                  onClick={() => project.id && navigateToProjectDetails(project.id)} 
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-status" data-status={project.status}>
                    {project.status}
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <div className="project-category">{project.category}</div>
                  <img 
                    className="project-image" 
                    src={project.mainImage} 
                    alt={project.title} 
                  />
                  <p className="project-description">{project.description}</p>
                  <div className="project-progress">
                    <div className="progress-label">
                      Progress: {Math.round((project.raisedAmount / project.goalAmount) * 100)}%
                    </div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${Math.round((project.raisedAmount / project.goalAmount) * 100)}%`,
                          backgroundColor:
                            project.status === "Funding" ? "#FF9800" :
                            project.status === "Completed" ? "#4CAF50" :
                            project.status === "Under Implementation" ? "#2196F3" :
                            project.status === "Cancelled" ? "#F44336" :
                            "#4CAF50"
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="project-footer">
                    <span className="project-location">{project.location}</span>
                    <span className="project-date">
                      Updated: {project.updatedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showAddForm && userData?.role === 'admin' && (
        <div className="modal">
          {renderAddProjectForm()}
        </div>
      )}
    </div>
  );
};

export default ProjectDiscovery;
