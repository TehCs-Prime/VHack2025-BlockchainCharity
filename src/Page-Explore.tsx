import "./Page-Explore.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


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

// Mock project data for demonstration
interface Project {
  id: number;
  title: string;
  status: Exclude<ProjectStatus, 'All'>;
  timing: Exclude<Timing, 'All'>;
  category: Exclude<Category, 'All'>;
  location: string;
  description: string;
  updatedAt: Date;
  progress: number; // Add progress property
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
const navigate = useNavigate();

const navigateToProjectDetails = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  // Sample projects for demonstration
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
    },
    {
      id: 4,
      title: 'Disaster Relief Program',
      status: 'Cancelled',
      timing: 'New Project',
      category: 'Disaster Recovery',
      location: 'Philippines',
      description: 'Emergency response and aid distribution',
      updatedAt: new Date('2025-03-10'),
      progress: 10,
    }
];


  // Handle checkbox changes with improved logic
  const handleCheckboxChange = (
    section: 'status' | 'timing' | 'categories',
    value: ProjectStatus | Timing | Category
  ) => {
    setFilters(prev => {
      const currentValues = [...prev[section]];
      
      // If clicking "All"
      if (value === 'All') {
        // If "All" is already selected, do nothing
        if (currentValues.includes('All')) {
          return prev;
        }
        // Otherwise, select only "All"
        return { ...prev, [section]: ['All'] };
      } 
      
      // If clicking a specific value
      const newValues = currentValues.filter(v => v !== 'All');
      const valueIndex = newValues.indexOf(value as never); // Fixed type error using 'never' instead of 'any'
      
      // If value is already selected, remove it
      if (valueIndex !== -1) {
        newValues.splice(valueIndex, 1);
        
        // If no specific values left, select "All"
        if (newValues.length === 0) {
          return { ...prev, [section]: ['All'] };
        }
      } else {
        // Add the value
        newValues.push(value as never); // Fixed type error using 'never' instead of 'any'
      }
      
      return { ...prev, [section]: newValues };
    });
  };

  // Handle location input change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, location: e.target.value }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      status: ['All'],
      timing: ['All'],
      categories: ['All'],
      location: '',
    });
    setSearchQuery('');
  };

  const getFilteredAndSortedProjects = (): Project[] => {
    // Start with all projects
    let filteredProjects = [...mockProjects];
    
    // Apply status filter
    if (!filters.status.includes('All')) {
      filteredProjects = filteredProjects.filter(project => 
        filters.status.includes(project.status)
      );
    }
    
    // Apply timing filter
    if (!filters.timing.includes('All')) {
      filteredProjects = filteredProjects.filter(project => 
        filters.timing.includes(project.timing)
      );
    }
    
    // Apply category filter
    if (!filters.categories.includes('All')) {
      filteredProjects = filteredProjects.filter(project => 
        filters.categories.includes(project.category)
      );
    }
    
    // Apply location filter
    if (filters.location.trim() !== '') {
      const locationLower = filters.location.toLowerCase().trim();
      filteredProjects = filteredProjects.filter(project => 
        project.location.toLowerCase().includes(locationLower)
      );
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const searchLower = searchQuery.toLowerCase().trim();
      filteredProjects = filteredProjects.filter(project => 
        project.title.toLowerCase().includes(searchLower) || 
        project.description.toLowerCase().includes(searchLower) ||
        project.category.toLowerCase().includes(searchLower) ||
        project.location.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort the filtered projects
    filteredProjects.sort((a, b) => {
      switch (sortBy) {
        case 'Name':
          return a.title.localeCompare(b.title);
        case 'Date created':
          // Since we don't have a creation date, using ID as a proxy
          // In a real app, you would use actual creation date
          return a.id - b.id;
        case 'Last updated':
        default:
          // Sort by most recent first
          return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });
    
    return filteredProjects;
  };

  return (
    <div className="project-discovery-container">
      <div className="page-title-container">
        <h1 className="page-title">Discover All Projects</h1>
      </div>
      
      <div className="content-layout">
        {/* Filter sidebar */}
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
        
        {/* Main content area */}
        <div className="projects-content">
          <div className="search-and-controls">
            <div className="search-bar">
              <img className="search-icon" src="/assets/SearchIcon.png" alt="Search"></img>
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
                  <option value="Last updated">Last updated</option>
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
          
          <div className={`projects-container ${viewMode.toLowerCase()}-view`}>
            {getFilteredAndSortedProjects().map(project => (
              <div className="project-card" key={project.id} onClick={() => navigateToProjectDetails(project.id)} style={{ cursor: 'pointer' }}>
                <div className="project-status" data-status={project.status}>
                  {project.status}
                </div>
                <h3 className="project-title">{project.title}</h3>
                <div className="project-category">{project.category}</div>
                <p className="project-description">{project.description}</p>
                
                {/* Progress bar addition */}
                <div className="project-progress">
                  <div className="progress-label">
                    Progress: {project.progress}%
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${project.progress}%` }}
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
        </div>
      </div>
    </div>
  );
};

export default ProjectDiscovery;