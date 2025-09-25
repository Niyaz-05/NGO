import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const ngoInitiatives = [
    {
      id: 1,
      title: "Women Empowerment",
      image: "https://www.planindia.org/wp-content/uploads/2019/08/young-helath.jpg",
      link: "/directory/women-empowerment"
    },
    {
      id: 2,
      title: "Healthcare Access",
      image: "https://savioursfoundation.org/wp-content/uploads/2020/03/Health.jpg",
      link: "/directory/healthcare"
    },
    {
      id: 3,
      title: "Education in Rural Areas",
      image: "https://drop.ndtv.com/albums/BUSINESS/ngo-education/educategirls.jpg",
      link: "/directory/education"
    },
    {
      id: 4,
      title: "Environment Conservation",
      image: "https://im.whatshot.in/img/2020/Jun/jeevit-cropped-1591264925.jpg",
      link: "/directory/environment"
    },
    {
      id: 5,
      title: "Disaster Relief",
      image: "https://www.casa-india.org/blog/wp-content/uploads/2023/08/Flood-Relief-Operations.jpg",
      link: "/directory/disaster-relief"
    }
  ];

  return (
    <div>
      {/* Header Banner */}
      <header className="custom-banner text-center">
        <div className="overlay-text">
          <h1 className="animated-gradient-text">Welcome To Unity Works Foundation</h1>
          <p className="lead" style={{fontSize: '2rem'}}>Bridging Help with Technology</p>
        </div>
      </header>

      {/* Active NGO Initiatives */}
      <section className="container-fluid py-4 bg-light">
        <h3 className="text-center mb-4">Active NGO Initiatives</h3>
        <div className="ngo-scroll-container">
          <div className="ngo-scroll-track">
            {[...ngoInitiatives, ...ngoInitiatives].map((initiative, index) => (
              <div key={`${initiative.id}-${index}`} className="ngo-card">
                <Link to={initiative.link}>
                  <img src={initiative.image} alt={initiative.title} />
                  <p>{initiative.title}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section bg-white">
        <div className="about-section">
          <div className="background-elements">
            <div className="bg-shape"></div>
            <div className="bg-shape"></div>
          </div>
          <div className="container">
            <div className="about-hero">
              <h2>About Unity Works Foundation</h2>
              <p>
                Unity Works Foundation is a centralized platform that bridges the gap between passion and purpose,
                connecting NGOs, donors, and volunteers to create meaningful social impact across communities worldwide.
              </p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🤝</div>
                <h3>Connect & Collaborate</h3>
                <p>We bring together NGOs, generous donors, and passionate volunteers on a unified platform...</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>Transparency First</h3>
                <p>Every donation, every project, and every impact is tracked and reported with transparency...</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>Streamlined Access</h3>
                <p>Our intuitive platform eliminates barriers and simplifies supporting causes...</p>
              </div>
            </div>
            <div className="stats-section">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">NGOs Connected</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Active Volunteers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">$2M+</div>
                  <div className="stat-label">Funds Raised</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Countries Reached</div>
                </div>
              </div>
            </div>
            <div className="mission-vision">
              <div className="mission-card">
                <h3>🎯 Our Mission</h3>
                <p>
                  To democratize social impact by creating a transparent, efficient, and collaborative ecosystem 
                  where every stakeholder—NGOs, donors, and volunteers—can easily find, connect with, and support 
                  causes that align with their values and create lasting positive change.
                </p>
              </div>
              <div className="vision-card">
                <h3>🌟 Our Vision</h3>
                <p>
                  A world where geographical boundaries and information gaps no longer limit social impact, 
                  where every person can effortlessly contribute to meaningful causes, and where NGOs have 
                  the resources and support they need to solve humanity's greatest challenges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-4">Contact Us</h2>
          
          <p>Email: <a href="mailto:info@suprazotech.in">info@suprazotech.in</a></p>
          <p>Phone: <a href="tel:+91-9665658240">+91-9665658240</a></p>
          <p>Address: Nagpur, Maharashtra, India</p>

          <div className="mt-4">
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <a href="https://twitter.com/ngoconnect" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://instagram.com/ngoconnect" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://linkedin.com/company/ngoconnect" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://facebook.com/ngoconnect" target="_blank" rel="noopener noreferrer" className="text-dark fs-4">
                <i className="bi bi-facebook"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
       
      </footer>
    </div>
  );
};

export default Home;
