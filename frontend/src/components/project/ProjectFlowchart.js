import React, { useEffect, useRef } from 'react';

const ProjectFlowchart = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Load mermaid library dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@8.14.0/dist/mermaid.min.js';
    script.async = true;
    
    script.onload = () => {
      // Initialize mermaid
      window.mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: { 
          primaryColor: '#f0f0f0', 
          primaryTextColor: '#333', 
          primaryBorderColor: '#666', 
          lineColor: '#555', 
          secondaryColor: '#e6f3fb', 
          tertiaryColor: '#fff' 
        }
      });
      
      // Render the flowchart
      window.mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    };
    
    document.body.appendChild(script);
    
    // Clean up
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', overflowX: 'auto' }}>
      <div className="mermaid">
        {`flowchart TB
    subgraph "Target Identification & Validation"
        A1[Depression with Executive\\nControl Network Dysfunction] --> A2[fMRI with N-back Task\\nto Identify Subtypes]
        A2 --> A3[Target Validation via\\nInflammatory Biomarkers]
    end
    
    subgraph "Hit Discovery"
        B1[Repurposing NSAIDs with\\nEvidence in Mood Disorders] --> B2[Screening for Effects on\\nExecutive Control Network]
        B2 --> B3[Selection of Ibuprofen\\n400mg TID]
        B3 --> B4[Anti-inflammatory Mechanism\\nValidation]
    end
    
    subgraph "Proof-of-Concept"
        C1[Mobile App Pre-screening\\nfor Inflammatory Factors] --> C2[Sequential Design Pilot\\nSelf-Control Study]
        C2 --> C3[Baseline & Post-treatment\\nfMRI + WPAI Assessment]
        C3 --> C4[Responder Analysis]
    end
    
    subgraph "Regulatory & Funding"
        D1[NIMH SBIR Grant\\nApplication] --> D2[Companion Diagnostic\\nDevelopment]
        D2 --> D3[Patient Advocacy\\nPartnerships]
        D3 --> D4[Comprehensive IP Portfolio\\nDevelopment]
    end
    
    subgraph "Phase 1 Clinical Trials"
        E1[Patient Selection via\\nfMRI Biomarker] --> E2[Dose-Finding Study]
        E2 --> E3[Functional Outcome\\nAssessment]
        E3 --> E4[Validation of Precision\\nMedicine Approach]
    end
    
    A3 --> B1
    B4 --> C1
    C4 --> D1
    D4 --> E1
    
    classDef preclinical fill:#f8e8d8,stroke:#444,stroke-width:2px,color:#111,font-weight:bold
    classDef clinical fill:#e6f3fb,stroke:#444,stroke-width:2px,color:#111,font-weight:bold
    classDef current fill:#e8f8e8,stroke:#444,stroke-width:2px,color:#111,font-weight:bold
    
    class A1,A2,A3,B1,B2,B3,B4 preclinical
    class E1,E2,E3,E4 clinical
    class C1,C2,C3,C4,D1,D2,D3,D4 current`}
      </div>
    </div>
  );
};

export default ProjectFlowchart;
