import React from 'react';

const Footer = () => {
  return (
    <footer className="p-3 mt-3 text-center">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Clinical Health Platform | Depression with Executive Control Network Dysfunction
        </p>
      </div>
    </footer>
  );
};

export default Footer;
