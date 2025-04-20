import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './components/dashboard/Dashboard';
import PatientList from './components/patients/PatientList';
import PatientDetail from './components/patients/PatientDetail';
import PatientForm from './components/patients/PatientForm';
import AssessmentList from './components/assessments/AssessmentList';
import AssessmentForm from './components/assessments/AssessmentForm';
import TreatmentList from './components/treatments/TreatmentList';
import TreatmentForm from './components/treatments/TreatmentForm';
import ProjectVision from './components/project/ProjectVision';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/edit/:id" element={<PatientForm />} />
            <Route path="/assessments" element={<AssessmentList />} />
            <Route path="/assessments/new" element={<AssessmentForm />} />
            <Route path="/assessments/edit/:id" element={<AssessmentForm />} />
            <Route path="/treatments" element={<TreatmentList />} />
            <Route path="/treatments/new" element={<TreatmentForm />} />
            <Route path="/treatments/edit/:id" element={<TreatmentForm />} />
            <Route path="/project-vision" element={<ProjectVision />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
