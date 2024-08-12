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
    heartScore: 0,
    dailySteps: 0,
    sleepDuration: '0min',
    weight: 0
  });
  

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const storage = JSON.parse(localStorage.getItem('userData'));
      
      // First, update the Terra API
      await updateTerraApi(storage.userId);

        const data = await getHealthData();
        console.log(data);
        setHealthData({
          heartScore: data.data.heartScore || 0,
          dailySteps: data.data.totalSteps || 0,
          sleepDuration: formatSleepDuration(data.data.sleepDuration || 0),
          weight: Number((data.data.weight || 0).toFixed(2))
        
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
            <HeartGaugeChart score={healthData.heartScore} />
          </GlassmorphicCard>
          
          <GlassmorphicCard title="Daily Steps" icon={<FaWalking className="text-blue-500 text-2xl" />}>
            <div className="text-4xl font-bold text-center">{healthData.dailySteps}</div>
            <div className="text-center mt-2">steps today</div>
          </GlassmorphicCard>
          
          <GlassmorphicCard title="Sleep" icon={<FaBed className="text-indigo-500 text-2xl" />}>
            <div className="text-4xl font-bold text-center">{healthData.sleepDuration}</div>
            <div className="text-center mt-2">last night</div>
          </GlassmorphicCard>
          
          <GlassmorphicCard title="Weight" icon={<FaWeight className="text-green-500 text-2xl" />}>
            <div className="text-4xl font-bold text-center">{healthData.weight} kg</div>
            <div className="text-center mt-2">current weight</div>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
};

export default Home;