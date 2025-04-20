# Clinical Health Platform Frontend

A React-based frontend for the clinical healthcare application focused on depression treatment with executive control network dysfunction.

## Features

- Dashboard with key metrics and visualization
- Patient management
- Assessment tracking (fMRI, N-back Task, WPAI)
- Treatment management (medication, dosage, efficacy)
- Project vision diagram with Mermaid.js
- Responsive design with simple CSS (no Tailwind)

## Tech Stack

- React 18
- React Router v6
- Chart.js for data visualization
- Mermaid.js for flowcharts
- Axios for API requests
- Playwright for testing

## Setup

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

   This will start the app on [http://localhost:3000](http://localhost:3000)

3. Build for production:
   ```
   npm run build
   ```

## Project Structure

- `/src/components` - React components organized by feature
  - `/layout` - Layout components (Navbar, Footer)
  - `/dashboard` - Dashboard and visualization components
  - `/patients` - Patient management components
  - `/assessments` - Assessment related components
  - `/treatments` - Treatment related components
  - `/project` - Project vision related components
- `/src/services` - API service
- `/public` - Static assets

## Playwright Tests

Run Playwright tests with:
```
npx playwright test
```

## Design

The application uses a simple and clean CSS design focusing on:

- Easy navigation with a consistent menu
- Card-based layout for content organization
- Visual differentiation of current phase vs clinical and preclinical phases
- Data visualization for patient outcomes
- Mobile responsiveness
