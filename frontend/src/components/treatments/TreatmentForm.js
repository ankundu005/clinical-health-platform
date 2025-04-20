import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const TreatmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;
  
  // Check if a patientId was passed via location state (from Patient Detail)
  const initialPatientId = location.state?.patientId || '';

  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: initialPatientId,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    medication_name: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'TID',
    is_active: true,
    is_responder: null,
    efficacy_rating: '',
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
        
        // If editing, fetch treatment data
        if (isEditMode) {
          const treatmentRes = await api.treatments.getById(id);
          const treatment = treatmentRes.data;
          
          // Format dates for form input
          if (treatment.start_date) {
            const startDateObj = new Date(treatment.start_date);
            treatment.start_date = startDateObj.toISOString().split('T')[0];
          }
          
          if (treatment.end_date) {
            const endDateObj = new Date(treatment.end_date);
            treatment.end_date = endDateObj.toISOString().split('T')[0];
          }
          
          setFormData(treatment);
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
    const { name, value, type, checked } = e.target;
    
    if (name === 'is_active' && checked === false && !formData.end_date) {
      // If deactivating a treatment and no end date set, default to today
      setFormData(prevData => ({
        ...prevData,
        is_active: checked,
        end_date: new Date().toISOString().split('T')[0]
      }));
    } else if (name === 'is_active' && checked === true) {
      // If reactivating, clear the end date
      setFormData(prevData => ({
        ...prevData,
        is_active: checked,
        end_date: ''
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: type === 'checkbox' 
                  ? checked 
                  : type === 'number' && value !== '' 
                    ? parseFloat(value) 
                    : value
      }));
    }
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
      if (apiData.efficacy_rating === '') {
        apiData.efficacy_rating = null;
      }
      
      // Parse patient_id as integer
      apiData.patient_id = parseInt(apiData.patient_id);

      if (isEditMode) {
        await api.treatments.update(id, apiData);
        setSuccessMessage('Treatment updated successfully!');
      } else {
        await api.treatments.create(apiData);
        setSuccessMessage('Treatment created successfully!');
        
        // Reset form if it's a new treatment but keep selected patient
        if (!isEditMode) {
          const selectedPatient = formData.patient_id;
          setFormData({
            patient_id: selectedPatient,
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            medication_name: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'TID',
            is_active: true,
            is_responder: null,
            efficacy_rating: '',
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
          navigate('/treatments');
        }
      }, 1500);
    } catch (err) {
      console.error('Error saving treatment:', err);
      setError('Failed to save treatment data. Please try again.');
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
      <h2>{isEditMode ? 'Edit Treatment' : 'Add New Treatment'}</h2>
      
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
                <label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    style={{ width: 'auto', marginRight: '0.5rem' }}
                  />
                  Active Treatment
                </label>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="start_date">Start Date *</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="end_date">End Date</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date || ''}
                  onChange={handleChange}
                  disabled={formData.is_active} // Disable if treatment is active
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="medication_name">Medication *</label>
                <select
                  id="medication_name"
                  name="medication_name"
                  value={formData.medication_name}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="Ibuprofen">Ibuprofen</option>
                  <option value="Naproxen">Naproxen</option>
                  <option value="Aspirin">Aspirin</option>
                  <option value="Celecoxib">Celecoxib</option>
                  <option value="Other">Other (specify in notes)</option>
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="dosage">Dosage *</label>
                <select
                  id="dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="400mg">400mg</option>
                  <option value="600mg">600mg</option>
                  <option value="800mg">800mg</option>
                  <option value="Other">Other (specify in notes)</option>
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="frequency">Frequency *</label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="QD">QD (Once daily)</option>
                  <option value="BID">BID (Twice daily)</option>
                  <option value="TID">TID (Three times daily)</option>
                  <option value="QID">QID (Four times daily)</option>
                  <option value="PRN">PRN (As needed)</option>
                  <option value="Other">Other (specify in notes)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="card-header mt-3 mb-3">
            <h4 className="card-title">Treatment Response</h4>
          </div>
          
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>Response Status:</label>
                <div>
                  <label style={{ marginRight: '1rem', fontWeight: 'normal' }}>
                    <input
                      type="radio"
                      name="is_responder"
                      value="null"
                      checked={formData.is_responder === null}
                      onChange={() => setFormData({...formData, is_responder: null})}
                      style={{ width: 'auto', marginRight: '0.5rem' }}
                    />
                    Not Evaluated
                  </label>
                  <label style={{ marginRight: '1rem', fontWeight: 'normal' }}>
                    <input
                      type="radio"
                      name="is_responder"
                      value="true"
                      checked={formData.is_responder === true}
                      onChange={() => setFormData({...formData, is_responder: true})}
                      style={{ width: 'auto', marginRight: '0.5rem' }}
                    />
                    Responder
                  </label>
                  <label style={{ fontWeight: 'normal' }}>
                    <input
                      type="radio"
                      name="is_responder"
                      value="false"
                      checked={formData.is_responder === false}
                      onChange={() => setFormData({...formData, is_responder: false})}
                      style={{ width: 'auto', marginRight: '0.5rem' }}
                    />
                    Non-Responder
                  </label>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="efficacy_rating">Efficacy Rating (1-10)</label>
                <input
                  type="number"
                  id="efficacy_rating"
                  name="efficacy_rating"
                  value={formData.efficacy_rating || ''}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  step="1"
                />
              </div>
            </div>
          </div>
          
          <div className="form-group mt-3">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
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
              {submitLoading ? 'Saving...' : 'Save Treatment'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => initialPatientId ? navigate(`/patients/${initialPatientId}`) : navigate('/treatments')}
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

export default TreatmentForm;
