import React, { useEffect, useState } from 'react';
import { FaHeart, FaWalking, FaBed, FaWeight } from 'react-icons/fa';
import HeartGaugeChart from '../components/heartGauge';
import { getHealthData ,updateTerraApi} from '../service/apihandler'; // Import the API handler
import moment from 'moment';
const GlassmorphicCard = ({ children, title, icon }) => (
  <div className="border border-gray-100 bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 rounded-xl p-6 shadow-lg">
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-semibold ml-2">{title}</h2>
    </div>
    {children}
  </div>
);
const formatSleepDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  let mins = minutes % 60;
  mins=Number(mins).toFixed(0)
  if (hours === 0) {
    return `${mins}min`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}min`;
  }
};

const Home = () => {
  const [healthData, setHealthData] = useState({
    heartScore: { value: 0, date: null },
    dailySteps: { value: 0, date: null },
    sleepDuration: { value: '0min', date: null },
    weight: { value: 0, date: null }
  });

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const storage = JSON.parse(localStorage.getItem('userData'));
      
        await updateTerraApi(storage.userId);

        const data = await getHealthData();
        setHealthData({
          heartScore: { 
            value: data.data.heartScore.value || 0, 
            date: data.data.heartScore.date 
          },
          dailySteps: { 
            value: data.data.totalSteps.value || 0, 
            date: data.data.totalSteps.date 
          },
          sleepDuration: { 
            value: formatSleepDuration(data.data.sleepDuration.value || 0), 
            date: data.data.sleepDuration.date 
          },
          weight: { 
            value: Number((data.data.weight.value || 0).toFixed(2)), 
            date: data.data.weight.date 
          }
        });
      } catch (error) {
        console.error('Failed to fetch health data:', error);
      }
    };

    fetchHealthData();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-800 mb-8">Health Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GlassmorphicCard title="Heart Health" icon={<FaHeart className="text-red-500 text-2xl" />}>
            <HeartGaugeChart score={healthData.heartScore.value} />
            <div className="text-center mt-2">Last updated: {healthData.heartScore.date}</div>
          </GlassmorphicCard>
          
          <GlassmorphicCard title="Daily Steps" icon={<FaWalking className="text-blue-500 text-2xl" />}>
            <div className="text-4xl font-bold text-center">{healthData.dailySteps.value}</div>
            <div className="text-center  mt-2">steps on {healthData.dailySteps.date}</div>
          </GlassmorphicCard>
          
          <GlassmorphicCard title="Sleep" icon={<FaBed className="text-indigo-500 text-2xl" />}>
            <div className="text-4xl font-bold text-center">{healthData.sleepDuration.value}</div>
            <div className="text-center mt-2">on {healthData.sleepDuration.date}</div>
          </GlassmorphicCard>
          
          <GlassmorphicCard title="Weight" icon={<FaWeight className="text-green-500 text-2xl" />}>
            <div className="text-4xl font-bold text-center">{healthData.weight.value} kg</div>
            <div className="text-center mt-2">as of {healthData.weight.date}</div>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
};

export default Home;