import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from './StatCard';
import PatientChart from './PatientChart';
import ProjectPhases from './ProjectPhases';

const Dashboard = () => {
  const [stats, setStats] = useState({
    patientCount: 0,
    assessmentCount: 0,
    treatmentCount: 0,
    activePatients: 0,
    responderRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data from API
        const [patientsRes, assessmentsRes, treatmentsRes] = await Promise.all([
          api.patients.getAll(),
          api.assessments.getAll(),
          api.treatments.getAll()
        ]);

        // Calculate stats
        const patients = patientsRes.data;
        const treatments = treatmentsRes.data;
        
        // Count active patients (with active treatments)
        const activePatientIds = new Set(
          treatments
            .filter(t => t.is_active)
            .map(t => t.patient_id)
        );
        
        // Calculate responder rate
        const respondersCount = treatments
          .filter(t => t.is_responder === true)
          .length;
        
        const totalWithResponseData = treatments
          .filter(t => t.is_responder !== null)
          .length;
        
        const responderRate = totalWithResponseData > 0
          ? (respondersCount / totalWithResponseData) * 100
          : 0;

        // Set stats
        setStats({
          patientCount: patients.length,
          assessmentCount: assessmentsRes.data.length,
          treatmentCount: treatments.length,
          activePatients: activePatientIds.size,
          responderRate: responderRate.toFixed(1)
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      <h2>Dashboard</h2>
      <p>Welcome to the Clinical Health Platform for Depression with Executive Control Network Dysfunction</p>
      
      <div className="row mb-3">
        <StatCard 
          title="Patients" 
          value={stats.patientCount} 
          icon="👤" 
          linkTo="/patients" 
        />
        <StatCard 
          title="Assessments" 
          value={stats.assessmentCount} 
          icon="📋" 
          linkTo="/assessments" 
        />
        <StatCard 
          title="Treatments" 
          value={stats.treatmentCount} 
          icon="💊" 
          linkTo="/treatments" 
        />
      </div>
      
      <div className="row mb-3">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Patient Status</h3>
            </div>
            <PatientChart 
              activePatients={stats.activePatients} 
              totalPatients={stats.patientCount} 
              responderRate={stats.responderRate} 
            />
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Project Phases</h3>
            </div>
            <ProjectPhases />
          </div>
        </div>
      </div>
      
      <div className="row mt-3">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="p-2">
              <Link to="/patients/new" className="btn btn-primary mr-1">Add Patient</Link>
              <Link to="/assessments/new" className="btn btn-secondary mr-1">New Assessment</Link>
              <Link to="/treatments/new" className="btn btn-secondary">New Treatment</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
