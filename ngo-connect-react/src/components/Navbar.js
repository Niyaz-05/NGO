import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/icons/Logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollNav = (sectionId) => (e) => {
    e.preventDefault();
    const goScroll = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      setTimeout(goScroll, 50);
    } else {
      goScroll();
    }

    // collapse mobile navbar after click
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = window.bootstrap?.Collapse ? window.bootstrap.Collapse.getInstance(navbarCollapse) : null;
      if (bsCollapse) bsCollapse.hide();
      else navbarCollapse.classList.remove('show');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand me-auto" to="/">
          <img src={logo} alt="NGO Connect Logo" height="50" />
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a href="/#about" className="nav-link" onClick={handleScrollNav('about')}>About</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/transparency">Transparency</Link>
            </li>
            <li className="nav-item">
              <a href="/#contact" className="nav-link" onClick={handleScrollNav('contact')}>Contact</a>
            </li>
            <li className="nav-item">
              <Link to="/auth/select-login" className="btn btn-outline-light">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
