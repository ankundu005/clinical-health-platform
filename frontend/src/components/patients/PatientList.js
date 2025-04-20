import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await api.patients.getAll();
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again later.');
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="row mb-3">
        <div className="col">
          <h2>Patients</h2>
        </div>
        <div className="col" style={{ textAlign: 'right' }}>
          <Link to="/patients/new" className="btn btn-primary">
            Add New Patient
          </Link>
        </div>
      </div>

      <div className="card mb-3">
        <div className="p-2">
          <input
            type="text"
            placeholder="Search patients by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control"
          />
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>ECN Dysfunction</th>
              <th>Inflammatory Markers</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <tr key={patient.id}>
                  <td>
                    <Link to={`/patients/${patient.id}`}>
                      {patient.first_name} {patient.last_name}
                    </Link>
                  </td>
                  <td>{patient.email}</td>
                  <td>
                    {patient.ecn_dysfunction_confirmed ? (
                      <span style={{ color: 'var(--error-color)' }}>Confirmed</span>
                    ) : (
                      'Not Confirmed'
                    )}
                  </td>
                  <td>
                    {patient.inflammatory_markers_level ? (
                      patient.inflammatory_markers_level > 2.0 ? (
                        <span style={{ color: 'var(--error-color)' }}>
                          High ({patient.inflammatory_markers_level})
                        </span>
                      ) : (
                        <span>
                          Normal ({patient.inflammatory_markers_level})
                        </span>
                      )
                    ) : (
                      'Not Measured'
                    )}
                  </td>
                  <td>
                    <Link to={`/patients/${patient.id}`} className="btn btn-secondary btn-sm mr-1">
                      View
                    </Link>
                    <Link to={`/patients/edit/${patient.id}`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  {searchTerm ? 'No patients matching your search' : 'No patients found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
