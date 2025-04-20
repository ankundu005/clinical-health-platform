import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const PatientChart = ({ activePatients, totalPatients, responderRate }) => {
  // Data for active vs inactive patients doughnut chart
  const activeData = {
    labels: ['Active Patients', 'Inactive Patients'],
    datasets: [
      {
        data: [activePatients, totalPatients - activePatients],
        backgroundColor: ['rgba(63, 81, 181, 0.8)', 'rgba(230, 243, 251, 0.8)'],
        borderColor: ['rgba(63, 81, 181, 1)', 'rgba(200, 213, 221, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Options for doughnut chart
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Active vs. Inactive Patients',
      },
    },
    cutout: '70%',
  };

  // Data for responder rate bar chart
  const responderData = {
    labels: ['Responder Rate'],
    datasets: [
      {
        label: 'Responder Rate (%)',
        data: [responderRate],
        backgroundColor: 'rgba(232, 248, 232, 0.8)',
        borderColor: 'rgba(200, 232, 200, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for bar chart
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Treatment Responder Rate',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className="row p-2">
      <div className="col">
        <Doughnut data={activeData} options={doughnutOptions} />
      </div>
      <div className="col">
        <Bar data={responderData} options={barOptions} />
      </div>
    </div>
  );
};

export default PatientChart;
