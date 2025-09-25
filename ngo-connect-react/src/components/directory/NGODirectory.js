import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ngoAPI } from '../../services/api';


// const NGODirectory = () => {
//   const ngos = [
//     {
//       id: 1,
//       name: "Women Empowerment Foundation",
//       category: "Women Empowerment",
//       image: "https://www.planindia.org/wp-content/uploads/2019/08/young-helath.jpg",
//       description: "Empowering women through education and skill development",
//       link: "/directory/women-empowerment"
//     },
//     {
//       id: 2,
//       name: "Healthcare Access Initiative",
//       category: "Healthcare",
//       image: "https://savioursfoundation.org/wp-content/uploads/2020/03/Health.jpg",
//       description: "Providing healthcare access to rural communities",
//       link: "/directory/healthcare"
//     },
//     {
//       id: 3,
//       name: "Rural Education Trust",
//       category: "Education",
//       image: "https://drop.ndtv.com/albums/BUSINESS/ngo-education/educategirls.jpg",
//       description: "Improving education in rural areas",
//       link: "/directory/education"
//     },
//     {
//       id: 4,
//       name: "Environmental Conservation Society",
//       category: "Environment",
//       image: "https://im.whatshot.in/img/2020/Jun/jeevit-cropped-1591264925.jpg",
//       description: "Protecting and conserving our environment",
//       link: "/directory/environment"
//     },
//     {
//       id: 5,
//       name: "Disaster Relief Network",
//       category: "Disaster Relief",
//       image: "https://www.casa-india.org/blog/wp-content/uploads/2023/08/Flood-Relief-Operations.jpg",
//       description: "Providing relief during natural disasters",
//       link: "/directory/disaster-relief"
//     }
//   ];
const NGODirectory=()=>{
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    ngoAPI.getAll()
      .then(({ data }) => { if (mounted) setNgos(data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="container mt-5"><h5>Loading NGOs...</h5></div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-5">NGO Directory</h1>
      
      <div className="row">
        {ngos.map((ngo) => (
          <div key={ngo.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{ngo.organizationName}</h5>
                <div className="mb-2">
                  {(ngo.causes && ngo.causes.length ? ngo.causes : (ngo.cause ? [ngo.cause] : [])).map((c, idx) => (
                    <span key={idx} className="badge bg-success me-1">{c}</span>
                  ))}
                </div>
                {ngo.description && <p className="card-text">{ngo.description}</p>}
                {ngo.website && <a href={ngo.website} target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm me-2">Website</a>}
                <Link to={`/ngo/${ngo.id}`} className="btn btn-success btn-sm">View Profile</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NGODirectory;
