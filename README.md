# Clinical Health Platform

A full-stack application for managing depression treatment with executive control network dysfunction, based on the precision medicine approach.

## Vision

Based on the flowchart design, this platform aims to implement a precision medicine approach for depression treatment targeting executive control network dysfunction, using inflammatory biomarkers as validation and exploring the efficacy of ibuprofen as a potential treatment option.

## Project Structure

- **Backend**: Python FastAPI application with SQLite database
- **Frontend**: React application with chart visualizations

## Key Phases (from Flowchart)

1. **Target Identification & Validation**
   - Depression with Executive Control Network Dysfunction
   - fMRI with N-back Task to Identify Subtypes
   - Target Validation via Inflammatory Biomarkers

2. **Hit Discovery**
   - Repurposing NSAIDs with Evidence in Mood Disorders
   - Screening for Effects on Executive Control Network
   - Selection of Ibuprofen 400mg TID
   - Anti-inflammatory Mechanism Validation

3. **Proof-of-Concept**
   - Mobile App Pre-screening for Inflammatory Factors
   - Sequential Design Pilot Self-Control Study
   - Baseline & Post-treatment fMRI + WPAI Assessment
   - Responder Analysis

4. **Regulatory & Funding**
   - NIMH SBIR Grant Application
   - Companion Diagnostic Development
   - Patient Advocacy Partnerships
   - Comprehensive IP Portfolio Development

5. **Phase 1 Clinical Trials**
   - Patient Selection via fMRI Biomarker
   - Dose-Finding Study
   - Functional Outcome Assessment
   - Validation of Precision Medicine Approach

## Running the Application

### Option 1: Using Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed
2. Clone the repository
3. Start the application:
   ```
   cd clinical-health-platform
   docker-compose up
   ```
4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. Make sure you have Python 3.9+ and Poetry installed
2. Install dependencies:
   ```
   cd clinical-health-platform/backend
   poetry install
   ```
3. Set up the database:
   ```
   poetry run alembic upgrade head
   ```
4. Start the development server:
   ```
   poetry run uvicorn app.main:app --reload
   ```

#### Frontend Setup

1. Make sure you have Node.js installed
2. Install dependencies:
   ```
   cd clinical-health-platform/frontend
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Testing

### Backend Tests

```
cd clinical-health-platform/backend
poetry run pytest
```

### Frontend Tests

```
cd clinical-health-platform/frontend
npx playwright test
```

## Documentation

- Backend API documentation: http://localhost:8000/docs
- Additional documentation for individual components can be found in their respective directories.
