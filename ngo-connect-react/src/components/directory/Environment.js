import React from 'react';
import { Link } from 'react-router-dom';

const Environment = () => {
  const environmentNGOs = [
    {
      id: 1,
      name: "Environmental Conservation Society",
      image: "https://im.whatshot.in/img/2020/Jun/jeevit-cropped-1591264925.jpg",
      description: "Protecting and conserving our environment through sustainable practices and awareness campaigns.",
      location: "Hyderabad, Telangana",
      focus: "Environmental Conservation, Sustainability, Awareness"
    }
  ];

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">Environment NGOs</h1>
          <p className="text-center mb-5">
            Organizations dedicated to environmental conservation and sustainable development.
          </p>
        </div>
      </div>

      <div className="row">
        {environmentNGOs.map((ngo) => (
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

export default Environment;
