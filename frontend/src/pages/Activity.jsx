import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { format, parseISO } from 'date-fns';
import { getActivityData } from '../service/apihandler'; // Import the API function
import { toast } from 'react-toastify';

ChartJS.register(...registerables);

const Activity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await getActivityData();
        setActivities(response.data);
      } catch (error) {
        console.error('Failed to fetch activity data:', error);
        toast.error("Failed to load activity data. Please try again.");
      }
    };

    fetchActivityData();
  }, []);

  const heartRateData = {
    labels: activities.map(a => a.type),
    datasets: [
      {
        label: 'Average Heart Rate',
        data: activities.map(a => a.heartRate.average),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Max Heart Rate',
        data: activities.map(a => a.heartRate.max),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const caloriesData = {
    labels: activities.map(a => a.type),
    datasets: [
      {
        label: 'Calories Burned',
        data: activities.map(a => a.calories),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const activityDistribution = {
    labels: activities.map(a => a.type),
    datasets: [
      {
        data: activities.map(a => a.distance),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className='min-h-screen p-8 bg-gradient-to-br from-purple-100 to-blue-200'>
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Activity</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Heart Rate Overview</h2>
          <Line data={heartRateData} />
        </div>
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Calories Burned</h2>
          <Bar data={caloriesData} />
        </div>
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Activity Distribution</h2>
          <Doughnut data={activityDistribution} />
        </div>
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activities</h2>
          <ul className="space-y-4">
            {activities.map((activity, index) => (
              <li key={index} className="border-b border-gray-200 pb-2">
                <h3 className="font-semibold text-gray-800">{activity.type}</h3>
                <p className="text-sm text-gray-600">
                  {format(parseISO(activity.startTime), 'PPp')} - {format(parseISO(activity.endTime), 'p')}
                </p>
                <p className="text-sm text-gray-600">
                  Distance: {activity.distance.toFixed(2)} m | Steps: {activity.steps} | Calories: {activity.calories.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Activity;