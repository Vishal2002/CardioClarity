import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { FaMoon, FaBed, FaHeartbeat, FaLungs, FaClock } from 'react-icons/fa';
import { getSleepData } from '../service/apihandler'; // Import the data-fetching function
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Sleep = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sleepData = await getSleepData();
        setData(sleepData.data);
      } catch (error) {
        setError(error.message || 'Failed to fetch sleep data');
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
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  const {
    heartRate,
    sleepDuration,
    respiration,
    startTime,
    endTime
  } = data;

  const sleepStagesData = {
    labels: ['Light Sleep', 'Deep Sleep', 'REM Sleep', 'Awake'],
    datasets: [{
      data: [
        sleepDuration.lightSleepDuration,
        sleepDuration.deepSleepDuration,
        sleepDuration.remSleepDuration,
        sleepDuration.awakeTime
      ],
      backgroundColor: [
        'rgba(255, 206, 86, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ],
      borderColor: [
        'rgba(255, 206, 86, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 1,
    }],
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-100 to-blue-200">
      <h2 className="text-3xl font-bold mb-6 text-indigo-800 flex items-center">
        Sleep Analysis
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600 flex items-center">
            <FaBed className="mr-2" /> Sleep Stages
          </h3>
          <Doughnut data={sleepStagesData} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600 flex items-center">
            <FaClock className="mr-2" /> Sleep Overview
          </h3>
          <p className="mb-2 flex items-center">
            <FaMoon className="mr-2" /> Total Sleep: 
            <span className="font-bold ml-2">{formatDuration(sleepDuration.totalSleepDuration)}</span>
          </p>
          <p className="mb-2 flex items-center">
            <FaBed className="mr-2" /> Sleep Efficiency: 
            <span className="font-bold ml-2">{sleepDuration.sleepEfficiency.toFixed(2)}%</span>
          </p>
          <p className="mb-2">Start: <span className="font-bold">{new Date(startTime).toLocaleString()}</span></p>
          <p>End: <span className="font-bold">{new Date(endTime).toLocaleString()}</span></p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600 flex items-center">
            <FaHeartbeat className="mr-2" /> Heart Rate
          </h3>
          <p className="mb-2">Average: <span className="font-bold">{heartRate.avgHeartRate} BPM</span></p>
          <p className="mb-2">Resting: <span className="font-bold">{heartRate.restingHeartRate} BPM</span></p>
          <p>Avg HRV: <span className="font-bold">{heartRate.avgHRV} ms</span></p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600 flex items-center">
            <FaLungs className="mr-2" /> Respiration
          </h3>
          <p className="mb-2">Avg Breath Rate: <span className="font-bold">{respiration.avgBreathRate} breaths/min</span></p>
          <p>Avg Oxygen Saturation: <span className="font-bold">{respiration.avgOxygenSaturation}%</span></p>
        </div>
      </div>
    </div>
  );
};

export default Sleep;
