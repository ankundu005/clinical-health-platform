import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch patient, assessments, and treatments in parallel
        const [patientRes, assessmentsRes, treatmentsRes] = await Promise.all([
          api.patients.getById(id),
          api.assessments.getByPatientId(id),
          api.treatments.getByPatientId(id)
        ]);
        
        setPatient(patientRes.data);
        setAssessments(assessmentsRes.data);
        setTreatments(treatmentsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeletePatient = async () => {
    try {
      await api.patients.delete(id);
      navigate('/patients');
    } catch (err) {
      console.error('Error deleting patient:', err);
      setError('Failed to delete patient. Please try again later.');
      setDeleteModalVisible(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Prepare data for assessment chart
  const prepareAssessmentChartData = () => {
    // Sort assessments by date
    const sortedAssessments = [...assessments].sort((a, b) => 
      new Date(a.assessment_date) - new Date(b.assessment_date)
    );
    
    // Extract data for the chart
    const labels = sortedAssessments.map(a => formatDate(a.assessment_date));
    const wpaiScores = sortedAssessments.map(a => a.wpai_score);
    const nBackScores = sortedAssessments.map(a => a.n_back_task_score);
    
    return {
      labels,
      datasets: [
        {
          label: 'WPAI Score',
          data: wpaiScores,
          backgroundColor: 'rgba(63, 81, 181, 0.6)',
          borderColor: 'rgba(63, 81, 181, 1)',
          borderWidth: 1
        },
        {
          label: 'N-Back Task Score',
          data: nBackScores,
          backgroundColor: 'rgba(248, 232, 216, 0.6)',
          borderColor: 'rgba(248, 232, 216, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Assessment Scores Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
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

  if (!patient) {
    return (
      <div className="alert alert-error">
        Patient not found
      </div>
    );
  }

  return (
    <div>
      <div className="row mb-3">
        <div className="col">
          <h2>
            {patient.first_name} {patient.last_name}
          </h2>
        </div>
        <div className="col" style={{ textAlign: 'right' }}>
          <Link to={`/patients/edit/${patient.id}`} className="btn btn-primary mr-1">
            Edit Patient
          </Link>
          <button 
            className="btn btn-secondary"
            onClick={() => setDeleteModalVisible(true)}
          >
            Delete Patient
          </button>
        </div>
      </div>
      
      {/* Patient Information */}
      <div className="card mb-3">
        <div className="card-header">
          <h3 className="card-title">Patient Information</h3>
        </div>
        <div className="p-2">
          <div className="row">
            <div className="col">
              <p><strong>Date of Birth:</strong> {formatDate(patient.date_of_birth)}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
            </div>
            <div className="col">
              <p>
                <strong>ECN Dysfunction:</strong> {' '}
                {patient.ecn_dysfunction_confirmed ? (
                  <span style={{ color: 'var(--error-color)' }}>Confirmed</span>
                ) : (
                  'Not Confirmed'
                )}
              </p>
              <p>
                <strong>Inflammatory Markers Level:</strong> {' '}
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
              </p>
              <p><strong>Created:</strong> {formatDate(patient.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Assessments */}
      <div className="card mb-3">
        <div className="card-header">
          <div className="row">
            <div className="col">
              <h3 className="card-title">Assessments</h3>
            </div>
            <div className="col" style={{ textAlign: 'right' }}>
              <Link 
                to={'/assessments/new'} 
                state={{ patientId: patient.id }}
                className="btn btn-secondary btn-sm"
              >
                Add Assessment
              </Link>
            </div>
          </div>
        </div>
        
        {assessments.length > 0 ? (
          <div>
            <div className="chart-container p-2">
              <Bar data={prepareAssessmentChartData()} options={chartOptions} />
            </div>
            
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>N-Back Score</th>
                  <th>WPAI Score</th>
                  <th>Inflammatory Markers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...assessments]
                  .sort((a, b) => new Date(b.assessment_date) - new Date(a.assessment_date))
                  .map(assessment => (
                    <tr key={assessment.id}>
                      <td>{formatDate(assessment.assessment_date)}</td>
                      <td>{assessment.assessment_type}</td>
                      <td>{assessment.n_back_task_score || 'N/A'}</td>
                      <td>{assessment.wpai_score || 'N/A'}</td>
                      <td>
                        {assessment.crp_level ? `CRP: ${assessment.crp_level}` : ''}
                        {assessment.il6_level ? `IL-6: ${assessment.il6_level}` : ''}
                        {assessment.tnf_alpha_level ? `TNF-α: ${assessment.tnf_alpha_level}` : ''}
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
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-3 text-center">
            <p>No assessments found for this patient.</p>
            <Link 
              to={'/assessments/new'} 
              state={{ patientId: patient.id }}
              className="btn btn-secondary"
            >
              Add First Assessment
            </Link>
          </div>
        )}
      </div>
      
      {/* Treatments */}
      <div className="card mb-3">
        <div className="card-header">
          <div className="row">
            <div className="col">
              <h3 className="card-title">Treatments</h3>
            </div>
            <div className="col" style={{ textAlign: 'right' }}>
              <Link 
                to={'/treatments/new'} 
                state={{ patientId: patient.id }}
                className="btn btn-secondary btn-sm"
              >
                Add Treatment
              </Link>
            </div>
          </div>
        </div>
        
        {treatments.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Status</th>
                <th>Response</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...treatments]
                .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
                .map(treatment => (
                  <tr key={treatment.id}>
                    <td>{formatDate(treatment.start_date)}</td>
                    <td>{formatDate(treatment.end_date)}</td>
                    <td>{treatment.medication_name}</td>
                    <td>{treatment.dosage}</td>
                    <td>
                      {treatment.is_active ? (
                        <span style={{ color: 'green' }}>Active</span>
                      ) : (
                        'Completed'
                      )}
                    </td>
                    <td>
                      {treatment.is_responder === null ? (
                        'Not Evaluated'
                      ) : treatment.is_responder ? (
                        <span style={{ color: 'green' }}>Responder</span>
                      ) : (
                        <span style={{ color: 'var(--error-color)' }}>Non-Responder</span>
                      )}
                    </td>
                    <td>
                      <Link 
                        to={`/treatments/edit/${treatment.id}`} 
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="p-3 text-center">
            <p>No treatments found for this patient.</p>
            <Link 
              to={'/treatments/new'} 
              state={{ patientId: patient.id }}
              className="btn btn-secondary"
            >
              Add First Treatment
            </Link>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteModalVisible && (
        <div className="modal" style={{
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            margin: '15% auto',
            padding: '20px',
            width: '50%',
            borderRadius: '4px'
          }}>
            <h4>Confirm Delete</h4>
            <p>Are you sure you want to delete this patient? This action cannot be undone.</p>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button 
                className="btn btn-secondary mr-1"
                onClick={() => setDeleteModalVisible(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleDeletePatient}
                style={{ backgroundColor: 'var(--error-color)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;
