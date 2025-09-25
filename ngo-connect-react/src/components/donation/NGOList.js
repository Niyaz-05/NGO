import React, { useState, useEffect, useCallback } from 'react';
import { ngoAPI } from '../../services/api';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaTimes } from 'react-icons/fa';

const NGOList = ({ onNGOSelect }) => {
  const [ngos, setNGOs] = useState([]);
  const [filteredNGOs, setFilteredNGOs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters to NGOs
  const applyFilters = useCallback((ngosToFilter) => {
    return ngosToFilter.filter(ngo => {
      const matchesName = !filters.name || 
        ngo.organization_name?.toLowerCase().includes(filters.name.toLowerCase());
      const matchesLocation = !filters.location || 
        ngo.location?.toLowerCase().includes(filters.location.toLowerCase());
      return matchesName && matchesLocation;
    });
  }, [filters.name, filters.location]);

  // Update filtered NGOs when filters or ngos change
  useEffect(() => {
    if (ngos.length > 0) {
      setFilteredNGOs(applyFilters(ngos));
    }
  }, [filters, ngos, applyFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      location: ''
    });
  };

  // Fetch NGO data from the database
  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        setIsLoading(true);
        const response = await ngoAPI.getAll();
        
        if (response && response.data) {
          setNGOs(response.data);
        } else {
          console.log('No NGOs found in the system');
          setNGOs([]);
        }
      } catch (error) {
        console.error('Error fetching NGOs:', error);
        setNGOs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNGOs();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading NGOs...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Search and Filter Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Search NGOs</h5>
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="me-1" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          <div className="input-group mb-3">
            <span className="input-group-text"><FaSearch /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name..."
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </div>

          {showFilters && (
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text"><FaMapMarkerAlt /></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Filter by location..."
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={clearFilters}
                  disabled={!filters.name && !filters.location}
                >
                  <FaTimes className="me-1" /> Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading NGOs...</p>
        </div>
      ) : filteredNGOs.length === 0 ? (
        <div className="text-center py-5">
          <h4>No NGOs found</h4>
          <p>There are currently no NGOs registered in the system.</p>
        </div>
      ) : (
        <div className="row">
          {filteredNGOs.map(ngo => (
            <div key={ngo.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{ngo.organization_name}</h5>
                  <p className="text-muted">{ngo.location || 'Location not specified'}</p>
                  <p className="card-text">
                    {ngo.description 
                      ? (ngo.description.length > 150 
                          ? `${ngo.description.substring(0, 150)}...` 
                          : ngo.description)
                      : 'No description available'}
                  </p>
                  <div className="mt-3">
                    <button 
                      className="btn btn-primary btn-sm w-100"
                      onClick={(e) => {
                        e.preventDefault();
                        onNGOSelect && onNGOSelect(ngo);
                      }}
                    >
                      Donate Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NGOList;
