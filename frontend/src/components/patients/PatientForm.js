import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    email: '',
    phone: '',
    ecn_dysfunction_confirmed: false,
    inflammatory_markers_level: ''
  });

  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await api.patients.getById(id);
          
          // Format date from ISO to YYYY-MM-DD for form input
          const patient = response.data;
          if (patient.date_of_birth) {
            const dateObj = new Date(patient.date_of_birth);
            patient.date_of_birth = dateObj.toISOString().split('T')[0];
          }
          
          setFormData(patient);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching patient:', err);
          setError('Failed to load patient data. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchPatient();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Create a copy of form data to send to API
      const apiData = { ...formData };
      
      // Convert empty string to null for numeric field
      if (apiData.inflammatory_markers_level === '') {
        apiData.inflammatory_markers_level = null;
      } else {
        apiData.inflammatory_markers_level = parseFloat(apiData.inflammatory_markers_level);
      }

      if (isEditMode) {
        await api.patients.update(id, apiData);
        setSuccessMessage('Patient updated successfully!');
      } else {
        await api.patients.create(apiData);
        setSuccessMessage('Patient created successfully!');
        
        // Clear form if it's new patient
        if (!isEditMode) {
          setFormData({
            first_name: '',
            last_name: '',
            date_of_birth: '',
            email: '',
            phone: '',
            ecn_dysfunction_confirmed: false,
            inflammatory_markers_level: ''
          });
        }
      }
      
      // Navigate back to patient list after a short delay
      setTimeout(() => {
        navigate('/patients');
      }, 1500);
    } catch (err) {
      console.error('Error saving patient:', err);
      setError('Failed to save patient data. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h2>{isEditMode ? 'Edit Patient' : 'Add New Patient'}</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="first_name">First Name *</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="last_name">Last Name *</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="date_of_birth">Date of Birth *</label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="inflammatory_markers_level">Inflammatory Markers Level</label>
                <input
                  type="number"
                  id="inflammatory_markers_level"
                  name="inflammatory_markers_level"
                  value={formData.inflammatory_markers_level || ''}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="ecn_dysfunction_confirmed"
                checked={formData.ecn_dysfunction_confirmed || false}
                onChange={handleChange}
                style={{ width: 'auto', marginRight: '0.5rem' }}
              />
              Executive Control Network Dysfunction Confirmed
            </label>
          </div>
          
          <div className="form-group mt-3">
            <button 
              type="submit" 
              className="btn btn-primary mr-1"
              disabled={submitLoading}
            >
              {submitLoading ? 'Saving...' : 'Save Patient'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/patients')}
              disabled={submitLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
