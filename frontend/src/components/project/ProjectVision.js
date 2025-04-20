import React from 'react';
import ProjectFlowchart from './ProjectFlowchart';

const ProjectVision = () => {
  return (
    <div>
      <h2>Project Vision</h2>
      
      <div className="card mb-3">
        <div className="card-header">
          <h3 className="card-title">Overview</h3>
        </div>
        <div className="p-2">
          <p>
            This platform supports a precision medicine approach to depression treatment, 
            focusing specifically on patients with executive control network dysfunction.
          </p>
          <p>
            Our hypothesis is that a subset of depression cases are associated with 
            inflammatory processes that affect the executive control network in the brain. 
            By identifying these patients through fMRI and inflammatory biomarkers, 
            we can target treatment with anti-inflammatory agents like ibuprofen.
          </p>
          <p>
            The platform facilitates patient screening, assessment tracking, treatment 
            management, and outcome analysis to validate this approach.
          </p>
        </div>
      </div>
      
      <div className="card mb-3">
        <div className="card-header">
          <h3 className="card-title">Project Flowchart</h3>
        </div>
        <div className="flowchart-container">
          <ProjectFlowchart />
        </div>
      </div>
      
      <div className="card mb-3">
        <div className="card-header">
          <h3 className="card-title">Key Innovations</h3>
        </div>
        <div className="p-2">
          <ul>
            <li className="mb-2">
              <strong>Biomarker-Driven Patient Selection:</strong> Using fMRI with N-back tasks to identify 
              patients with executive control network dysfunction.
            </li>
            <li className="mb-2">
              <strong>Inflammatory Validation:</strong> Measuring inflammatory biomarkers (CRP, IL-6, TNF-alpha) 
              to confirm the inflammatory subtype of depression.
            </li>
            <li className="mb-2">
              <strong>Repurposed Medication:</strong> Testing ibuprofen (400mg TID) as a low-cost, accessible 
              treatment option with established safety profile.
            </li>
            <li className="mb-2">
              <strong>Functional Outcomes:</strong> Measuring improvements in work productivity and activity 
              impairment (WPAI) alongside clinical depression outcomes.
            </li>
            <li className="mb-2">
              <strong>Data-Driven Approach:</strong> Platform captures comprehensive data to support 
              regulatory approval and further research.
            </li>
          </ul>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Clinical Impact</h3>
        </div>
        <div className="p-2">
          <p>
            Depression affects approximately 280 million people worldwide, with about 
            30% not responding to conventional treatments. Our approach targets a subset 
            of these treatment-resistant cases by addressing a specific biological mechanism.
          </p>
          <p>
            If successful, this precision medicine approach could:
          </p>
          <ul>
            <li>Provide relief for patients who don't respond to traditional antidepressants</li>
            <li>Reduce healthcare costs by using inexpensive, approved medications</li>
            <li>Minimize side effects compared to traditional antidepressants</li>
            <li>Improve functional outcomes and quality of life</li>
            <li>Establish a model for targeted treatments in psychiatry</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectVision;
