import React from 'react';

const ProjectPhases = () => {
  const phases = [
    {
      name: 'Target Identification & Validation',
      status: 'preclinical',
      steps: [
        'Depression with Executive Control Network Dysfunction',
        'fMRI with N-back Task to Identify Subtypes',
        'Target Validation via Inflammatory Biomarkers'
      ]
    },
    {
      name: 'Hit Discovery',
      status: 'preclinical',
      steps: [
        'Repurposing NSAIDs with Evidence in Mood Disorders',
        'Screening for Effects on Executive Control Network',
        'Selection of Ibuprofen 400mg TID',
        'Anti-inflammatory Mechanism Validation'
      ]
    },
    {
      name: 'Proof-of-Concept',
      status: 'current',
      steps: [
        'Mobile App Pre-screening for Inflammatory Factors',
        'Sequential Design Pilot Self-Control Study',
        'Baseline & Post-treatment fMRI + WPAI Assessment',
        'Responder Analysis'
      ]
    },
    {
      name: 'Regulatory & Funding',
      status: 'current',
      steps: [
        'NIMH SBIR Grant Application',
        'Companion Diagnostic Development',
        'Patient Advocacy Partnerships',
        'Comprehensive IP Portfolio Development'
      ]
    },
    {
      name: 'Phase 1 Clinical Trials',
      status: 'clinical',
      steps: [
        'Patient Selection via fMRI Biomarker',
        'Dose-Finding Study',
        'Functional Outcome Assessment',
        'Validation of Precision Medicine Approach'
      ]
    }
  ];

  // Get status label for display
  const getStatusLabel = (status) => {
    switch (status) {
      case 'preclinical':
        return 'Preclinical';
      case 'current':
        return 'Current';
      case 'clinical':
        return 'Clinical';
      default:
        return status;
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'preclinical':
        return { backgroundColor: 'var(--accent-color)', color: 'var(--text-primary)' };
      case 'current':
        return { backgroundColor: 'var(--success-color)', color: 'var(--text-primary)' };
      case 'clinical':
        return { backgroundColor: 'var(--secondary-color)', color: 'var(--text-primary)' };
      default:
        return { backgroundColor: 'var(--border-color)', color: 'var(--text-primary)' };
    }
  };

  return (
    <div className="p-2">
      {phases.map((phase, index) => (
        <div key={index} className={`card phase-card phase-${phase.status} mb-2`}>
          <div className="row">
            <div className="col">
              <h4>{phase.name}</h4>
              <span 
                style={{ 
                  ...getStatusBadgeClass(phase.status),
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginBottom: '0.5rem'
                }}
              >
                {getStatusLabel(phase.status)}
              </span>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {phase.steps.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectPhases;
