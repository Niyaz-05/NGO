import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-3 bg-dark text-white">
      <div className="container text-center">
        <small>© {new Date().getFullYear()} </small>
      </div>
    </footer>
  );
};

export default Footer;

