import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const HeartGaugeChart = ({ score }) => {
  const chartRef = useRef(null);

  
  const normalizedScore = Math.min(Math.max(score, 0), 10);
  const remainingValue = 10 - normalizedScore;

  const data = {
    datasets: [
      {
        data: [normalizedScore, remainingValue],
        backgroundColor: [
          normalizedScore <= 3 ? '#ff4d4d' : normalizedScore <= 5 ? '#ffa500' : '#4caf50',
          '#e0e0e0'
        ],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };


  return (
    <div style={{ width: '300px', height: '200px', position: 'relative' }}>
      <Doughnut data={data} options={options} ref={chartRef} />
       
    </div>
  );
};

export default HeartGaugeChart;