import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, linkTo }) => {
  return (
    <div className="col">
      <Link to={linkTo} style={{ textDecoration: 'none' }}>
        <div className="card">
          <div className="row">
            <div className="col" style={{ flex: '0 0 30%', fontSize: '2.5rem', textAlign: 'center' }}>
              {icon}
            </div>
            <div className="col">
              <h3>{title}</h3>
              <p style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default StatCard;
