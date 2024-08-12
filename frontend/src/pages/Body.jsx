import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from 'moment';
import { getBodyData } from '../service/apihandler';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Body = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBodyData();
        setData(data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error.message}</div>;
  }

  const { heartRateData, oxygenData, bodyMeasurements } = data;

  const weightData = {
    labels: bodyMeasurements.map(m => moment(m.measurementTime).format('DD-MM-YYYY')),
    datasets: [{
      label: 'Weight (kg)',
      data: bodyMeasurements.map(m => m.weightKg),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const bmiData = {
    labels: bodyMeasurements.map(m => moment(m.measurementTime).format('DD-MM-YYYY')),
    datasets: [{
      label: 'BMI',
      data: bodyMeasurements.map(m => m.bmi),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }]
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-100 to-blue-200">
      <h2 className="text-3xl font-bold mb-6 text-purple-800">Body Measurements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-600">Weight Over Time</h3>
          <Line data={weightData} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-600">BMI Over Time</h3>
          <Bar data={bmiData} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-600">Heart Rate Summary</h3>
          <p className="mb-2">Average HR: <span className="font-bold">{heartRateData.avgHrBpm.toFixed(2)} BPM</span></p>
          <p className="mb-2">Resting HR: <span className="font-bold">{heartRateData.restingHrBpm.toFixed(2)} BPM</span></p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-600">Oxygen Data</h3>
          <p className="mb-2">Average Saturation: <span className="font-bold">{oxygenData.avgSaturationPercentage.toFixed(2)}%</span></p>
          <p>VO2 Max: <span className="font-bold">{oxygenData.vo2Max.toFixed(2)} ml/kg/min</span></p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-purple-600">Body Composition</h3>
          <p>Latest Body Fat: <span className="font-bold">{bodyMeasurements[bodyMeasurements.length - 1].bodyfatPercentage.toFixed(2)}%</span></p>
        </div>
      </div>
    </div>
  );
};

export default Body;
