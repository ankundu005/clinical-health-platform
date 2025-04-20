import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const AssessmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;
  
  // Check if a patientId was passed via location state (from Patient Detail)
  const initialPatientId = location.state?.patientId || '';

  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: initialPatientId,
    assessment_date: new Date().toISOString().split('T')[0],
    assessment_type: '',
    fmri_data: {},
    n_back_task_score: '',
    wpai_score: '',
    crp_level: '',
    il6_level: '',
    tnf_alpha_level: '',
    notes: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch patients for dropdown
        const patientsRes = await api.patients.getAll();
        setPatients(patientsRes.data);
        
        // If editing, fetch assessment data
        if (isEditMode) {
          const assessmentRes = await api.assessments.getById(id);
          const assessment = assessmentRes.data;
          
          // Format date for form input
          if (assessment.assessment_date) {
            const dateObj = new Date(assessment.assessment_date);
            assessment.assessment_date = dateObj.toISOString().split('T')[0];
          }
          
          setFormData(assessment);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
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
      
      // Convert empty strings to null for numeric fields
      ['n_back_task_score', 'wpai_score', 'crp_level', 'il6_level', 'tnf_alpha_level'].forEach(field => {
        if (apiData[field] === '') {
          apiData[field] = null;
        }
      });
      
      // Parse patient_id as integer
      apiData.patient_id = parseInt(apiData.patient_id);

      if (isEditMode) {
        await api.assessments.update(id, apiData);
        setSuccessMessage('Assessment updated successfully!');
      } else {
        await api.assessments.create(apiData);
        setSuccessMessage('Assessment created successfully!');
        
        // Reset form if it's a new assessment but keep selected patient
        if (!isEditMode) {
          const selectedPatient = formData.patient_id;
          setFormData({
            patient_id: selectedPatient,
            assessment_date: new Date().toISOString().split('T')[0],
            assessment_type: '',
            fmri_data: {},
            n_back_task_score: '',
            wpai_score: '',
            crp_level: '',
            il6_level: '',
            tnf_alpha_level: '',
            notes: ''
          });
        }
      }
      
      // Navigate back after a short delay
      setTimeout(() => {
        // If we got here from a patient detail page, go back to that patient
        if (initialPatientId) {
          navigate(`/patients/${initialPatientId}`);
        } else {
          navigate('/assessments');
        }
      }, 1500);
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError('Failed to save assessment data. Please try again.');
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
      <h2>{isEditMode ? 'Edit Assessment' : 'Add New Assessment'}</h2>
      
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
                <label htmlFor="patient_id">Patient *</label>
                <select
                  id="patient_id"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  required
                  className="form-control"
                  disabled={!!initialPatientId} // Disable if patient was pre-selected
                >
                  <option value="">Select Patient</option>
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
                <label htmlFor="assessment_date">Assessment Date *</label>
                <input
                  type="date"
                  id="assessment_date"
                  name="assessment_date"
                  value={formData.assessment_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="assessment_type">Assessment Type *</label>
                <select
                  id="assessment_type"
                  name="assessment_type"
                  value={formData.assessment_type}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="">Select Type</option>
                  <option value="fMRI">fMRI</option>
                  <option value="N-back Task">N-back Task</option>
                  <option value="WPAI">WPAI (Work Productivity)</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="Comprehensive">Comprehensive</option>
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="n_back_task_score">N-Back Task Score</label>
                <input
                  type="number"
                  id="n_back_task_score"
                  name="n_back_task_score"
                  value={formData.n_back_task_score}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="wpai_score">WPAI Score</label>
                <input
                  type="number"
                  id="wpai_score"
                  name="wpai_score"
                  value={formData.wpai_score}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                />
                <small style={{ display: 'block', color: 'var(--text-secondary)' }}>
                  Work Productivity and Activity Impairment (0-100)
                </small>
              </div>
            </div>
            <div className="col">
              {/* Empty column for balance */}
            </div>
          </div>
          
          <div className="card-header mt-3 mb-3">
            <h4 className="card-title">Inflammatory Biomarkers</h4>
          </div>
          
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="crp_level">CRP Level</label>
                <input
                  type="number"
                  id="crp_level"
                  name="crp_level"
                  value={formData.crp_level}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                />
                <small style={{ display: 'block', color: 'var(--text-secondary)' }}>
                  C-reactive protein (mg/L)
                </small>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="il6_level">IL-6 Level</label>
                <input
                  type="number"
                  id="il6_level"
                  name="il6_level"
                  value={formData.il6_level}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                />
                <small style={{ display: 'block', color: 'var(--text-secondary)' }}>
                  Interleukin-6 (pg/mL)
                </small>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="tnf_alpha_level">TNF-α Level</label>
                <input
                  type="number"
                  id="tnf_alpha_level"
                  name="tnf_alpha_level"
                  value={formData.tnf_alpha_level}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                />
                <small style={{ display: 'block', color: 'var(--text-secondary)' }}>
                  Tumor Necrosis Factor Alpha (pg/mL)
                </small>
              </div>
            </div>
          </div>
          
          <div className="form-group mt-3">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="form-control"
            ></textarea>
          </div>
          
          <div className="form-group mt-3">
            <button 
              type="submit" 
              className="btn btn-primary mr-1"
              disabled={submitLoading}
            >
              {submitLoading ? 'Saving...' : 'Save Assessment'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => initialPatientId ? navigate(`/patients/${initialPatientId}`) : navigate('/assessments')}
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

export default AssessmentForm;
