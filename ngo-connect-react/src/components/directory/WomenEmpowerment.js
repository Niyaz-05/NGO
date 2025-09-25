import React from 'react';
import { Link } from 'react-router-dom';

const WomenEmpowerment = () => {
  const womenEmpowermentNGOs = [
    {
      id: 1,
      name: "Women Empowerment Foundation",
      image: "https://www.planindia.org/wp-content/uploads/2019/08/young-helath.jpg",
      description: "Empowering women through education, skill development, and economic opportunities.",
      location: "Mumbai, Maharashtra",
      focus: "Education, Skill Development, Economic Empowerment"
    },
    {
      id: 2,
      name: "Sakhi Foundation",
      image: "https://www.planindia.org/wp-content/uploads/2019/08/young-helath.jpg",
      description: "Supporting women's rights and providing resources for their development.",
      location: "Delhi, NCR",
      focus: "Women's Rights, Legal Support, Advocacy"
    }
  ];

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">Women Empowerment NGOs</h1>
          <p className="text-center mb-5">
            Organizations dedicated to empowering women through education, skill development, and economic opportunities.
          </p>
        </div>
      </div>

      <div className="row">
        {womenEmpowermentNGOs.map((ngo) => (
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

export default WomenEmpowerment;
