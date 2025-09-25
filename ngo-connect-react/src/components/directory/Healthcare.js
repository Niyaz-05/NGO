import React from 'react';
import { Link } from 'react-router-dom';

const Healthcare = () => {
  const healthcareNGOs = [
    {
      id: 1,
      name: "Healthcare Access Initiative",
      image: "https://savioursfoundation.org/wp-content/uploads/2020/03/Health.jpg",
      description: "Providing healthcare access to rural communities through mobile clinics and health camps.",
      location: "Bangalore, Karnataka",
      focus: "Rural Healthcare, Mobile Clinics, Health Camps"
    },
    {
      id: 2,
      name: "Medical Aid Foundation",
      image: "https://savioursfoundation.org/wp-content/uploads/2020/03/Health.jpg",
      description: "Supporting medical facilities and providing healthcare to underprivileged communities.",
      location: "Chennai, Tamil Nadu",
      focus: "Medical Facilities, Healthcare Support, Community Health"
    }
  ];

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">Healthcare NGOs</h1>
          <p className="text-center mb-5">
            Organizations dedicated to providing healthcare access and medical support to communities in need.
          </p>
        </div>
      </div>

      <div className="row">
        {healthcareNGOs.map((ngo) => (
          <div key={ngo.id} className="col-md-6 mb-4">
            <div className="card h-100">
              <img 
                src={ngo.image} 
                className="card-img-top" 
                alt={ngo.name}
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{ngo.name}</h5>
                <p className="card-text">{ngo.description}</p>
                <p className="card-text">
                  <small className="text-muted">
                    <strong>Location:</strong> {ngo.location}
                  </small>
                </p>
                <p className="card-text">
                  <small className="text-muted">
                    <strong>Focus Areas:</strong> {ngo.focus}
                  </small>
                </p>
               
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <Link to="/directory/ngo-directory" className="btn btn-outline-secondary">
          Back to NGO Directory
        </Link>
      </div>
    </div>
  );
};

export default Healthcare;
