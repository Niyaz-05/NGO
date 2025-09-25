import React from 'react';
import { Link } from 'react-router-dom';

const DisasterRelief = () => {
  const disasterReliefNGOs = [
    {
      id: 1,
      name: "Disaster Relief Network",
      image: "https://www.casa-india.org/blog/wp-content/uploads/2023/08/Flood-Relief-Operations.jpg",
      description: "Providing relief during natural disasters through emergency response and recovery support.",
      location: "Kolkata, West Bengal",
      focus: "Emergency Response, Disaster Recovery, Relief Support"
    }
  ];

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">Disaster Relief NGOs</h1>
          <p className="text-center mb-5">
            Organizations dedicated to providing emergency response and relief during natural disasters.
          </p>
        </div>
      </div>

      <div className="row">
        {disasterReliefNGOs.map((ngo) => (
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

export default DisasterRelief;
