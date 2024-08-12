import React, { useEffect, useState } from 'react';
import { FaHeart, FaBed, FaLungs, FaBolt, FaBalanceScale } from 'react-icons/fa';
import HeartGaugeChart from '../components/heartGauge';
import { getScoreboardData } from '../service/apihandler';

const ScoreCard = ({ title, score, icon, feedback }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <HeartGaugeChart score={score} />
    <p className="text-sm mt-2 text-center">{feedback}</p>
  </div>
);

const Scoreboard = () => {
  const [data, setData] = useState(null);
  console.log(data);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getScoreboardData();
        console.log(data.data);
        setData(data.data);
      } catch (error) {

        setError(error.message || 'Failed to fetch data');
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

  const { overallScore, componentScores, feedback } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Health Scoreboard</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overall Score: {overallScore}/10</h2>
        <p className="text-gray-700">{feedback.overallSummary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ScoreCard 
          title="Heart Score" 
          score={componentScores.heartScore} 
          icon={<FaHeart className="text-red-500" />}
          feedback={feedback.componentFeedback.heart}
        />
        <ScoreCard 
          title="Sleep Score" 
          score={componentScores.sleepScore} 
          icon={<FaBed className="text-blue-500" />}
          feedback={feedback.componentFeedback.sleep}
        />
        <ScoreCard 
          title="Oxygen Score" 
          score={componentScores.oxygenScore} 
          icon={<FaLungs className="text-green-500" />}
          feedback={feedback.componentFeedback.oxygen}
        />
        <ScoreCard 
          title="HRV Score" 
          score={componentScores.hrvScore} 
          icon={<FaBolt className="text-yellow-500" />}
          feedback={feedback.componentFeedback.hrv}
        />
        <ScoreCard 
          title="Stress Score" 
          score={componentScores.stressScore} 
          icon={<FaBalanceScale className="text-purple-500" />}
          feedback={feedback.componentFeedback.stress}
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>
        <ul className="list-disc pl-5">
          {feedback.recommendations.map((rec, index) => (
            <li key={index} className="mb-2">{rec}</li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
        <p className="font-bold">Motivational Message:</p>
        <p>{feedback.motivationalMessage}</p>
      </div>
    </div>
  );
};

export default Scoreboard;
