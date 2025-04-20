import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch assessments and patients in parallel
        const [assessmentsRes, patientsRes] = await Promise.all([
          api.assessments.getAll(),
          api.patients.getAll()
        ]);
        
        setAssessments(assessmentsRes.data);
        setPatients(patientsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError('Failed to load assessments. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get patient name by ID
  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
  };

  // Filter assessments by selected patient
  const filteredAssessments = selectedPatient === 'all'
    ? assessments
    : assessments.filter(a => a.patient_id === parseInt(selectedPatient));

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
          <h2>Assessments</h2>
        </div>
        <div className="col" style={{ textAlign: 'right' }}>
          <Link to="/assessments/new" className="btn btn-primary">
            Add New Assessment
          </Link>
        </div>
      </div>

      <div className="card mb-3">
        <div className="p-2">
          <label htmlFor="patient-filter">Filter by Patient:</label>
          <select
            id="patient-filter"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="form-control"
          >
            <option value="all">All Patients</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.first_name} {patient.last_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient</th>
              <th>Type</th>
              <th>N-Back Score</th>
              <th>WPAI Score</th>
              <th>Inflammatory Markers</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssessments.length > 0 ? (
              [...filteredAssessments]
                .sort((a, b) => new Date(b.assessment_date) - new Date(a.assessment_date))
                .map(assessment => (
                  <tr key={assessment.id}>
                    <td>{formatDate(assessment.assessment_date)}</td>
                    <td>
                      <Link to={`/patients/${assessment.patient_id}`}>
                        {getPatientName(assessment.patient_id)}
                      </Link>
                    </td>
                    <td>{assessment.assessment_type}</td>
                    <td>{assessment.n_back_task_score || 'N/A'}</td>
                    <td>{assessment.wpai_score || 'N/A'}</td>
                    <td>
                      {assessment.crp_level ? `CRP: ${assessment.crp_level}` : ''}
                      {assessment.il6_level ? (assessment.crp_level ? ', ' : '') + `IL-6: ${assessment.il6_level}` : ''}
                      {assessment.tnf_alpha_level ? 
                        ((assessment.crp_level || assessment.il6_level) ? ', ' : '') + 
                        `TNF-α: ${assessment.tnf_alpha_level}` 
                        : ''
                      }
                      {!assessment.crp_level && !assessment.il6_level && !assessment.tnf_alpha_level ? 'N/A' : ''}
                    </td>
                    <td>
                      <Link 
                        to={`/assessments/edit/${assessment.id}`} 
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  {selectedPatient !== 'all' 
                    ? 'No assessments found for selected patient' 
                    : 'No assessments found'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssessmentList;
