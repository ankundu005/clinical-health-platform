import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TreatmentList = () => {
  const [treatments, setTreatments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch treatments and patients in parallel
        const [treatmentsRes, patientsRes] = await Promise.all([
          api.treatments.getAll(),
          api.patients.getAll()
        ]);
        
        setTreatments(treatmentsRes.data);
        setPatients(patientsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching treatments:', err);
        setError('Failed to load treatments. Please try again later.');
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

  // Calculate stats for the chart
  const calculateStats = () => {
    // Get treatments that have response data
    const evaluatedTreatments = treatments.filter(t => t.is_responder !== null);
    
    if (evaluatedTreatments.length === 0) {
      return {
        responders: 0,
        nonResponders: 0,
        responderRate: 0
      };
    }
    
    const responders = evaluatedTreatments.filter(t => t.is_responder).length;
    const nonResponders = evaluatedTreatments.length - responders;
    const responderRate = (responders / evaluatedTreatments.length) * 100;
    
    return {
      responders,
      nonResponders,
      responderRate: responderRate.toFixed(1)
    };
  };

  // Prepare data for the chart
  const prepareChartData = () => {
    const stats = calculateStats();
    
    return {
      labels: ['Responders', 'Non-Responders'],
      datasets: [
        {
          data: [stats.responders, stats.nonResponders],
          backgroundColor: ['rgba(232, 248, 232, 0.8)', 'rgba(248, 232, 216, 0.8)'],
          borderColor: ['rgba(200, 232, 200, 1)', 'rgba(230, 200, 180, 1)'],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Treatment Response Distribution',
      },
    },
    cutout: '70%',
  };

  // Filter treatments based on selections
  const filteredTreatments = treatments.filter(treatment => {
    const patientMatch = selectedPatient === 'all' || treatment.patient_id === parseInt(selectedPatient);
    const statusMatch = selectedStatus === 'all' || 
                        (selectedStatus === 'active' && treatment.is_active) ||
                        (selectedStatus === 'completed' && !treatment.is_active);
    
    return patientMatch && statusMatch;
  });

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

  const stats = calculateStats();

  return (
    <div>
      <div className="row mb-3">
        <div className="col">
          <h2>Treatments</h2>
        </div>
        <div className="col" style={{ textAlign: 'right' }}>
          <Link to="/treatments/new" className="btn btn-primary">
            Add New Treatment
          </Link>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Filters</h3>
            </div>
            <div className="p-2">
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="patient-filter">Patient:</label>
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
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="status-filter">Status:</label>
                    <select
                      id="status-filter"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="form-control"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card" style={{ height: '100%' }}>
            <div className="card-header">
              <h3 className="card-title">Response Rate</h3>
            </div>
            <div className="p-2 text-center">
              <h2 style={{ color: 'var(--primary-color)' }}>{stats.responderRate}%</h2>
              <p>of evaluated patients respond to treatment</p>
              <div style={{ height: '120px', width: '120px', margin: '0 auto' }}>
                <Doughnut data={prepareChartData()} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Start Date</th>
              <th>Patient</th>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Status</th>
              <th>Response</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTreatments.length > 0 ? (
              [...filteredTreatments]
                .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
                .map(treatment => (
                  <tr key={treatment.id}>
                    <td>{formatDate(treatment.start_date)}</td>
                    <td>
                      <Link to={`/patients/${treatment.patient_id}`}>
                        {getPatientName(treatment.patient_id)}
                      </Link>
                    </td>
                    <td>{treatment.medication_name}</td>
                    <td>{treatment.dosage}</td>
                    <td>{treatment.frequency}</td>
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
                ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  {selectedPatient !== 'all' || selectedStatus !== 'all'
                    ? 'No treatments match your filters'
                    : 'No treatments found'
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

export default TreatmentList;
