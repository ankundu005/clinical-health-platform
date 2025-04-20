import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          Clinical Health Platform
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/patients" className="nav-link">Patients</Link>
          </li>
          <li className="nav-item">
            <Link to="/assessments" className="nav-link">Assessments</Link>
          </li>
          <li className="nav-item">
            <Link to="/treatments" className="nav-link">Treatments</Link>
          </li>
          <li className="nav-item">
            <Link to="/project-vision" className="nav-link">Project Vision</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
