import React from 'react';

const Alerts = ({ ecgData }) => {
  if (!ecgData || ecgData.length === 0) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-purple-100 to-blue-200 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-purple-800">No Alerts</h2>
          <img src="/path-to-your-image/heart-icon.svg" alt="Healthy Heart" className="mx-auto w-24 h-24 mb-4" />
          <p className="text-lg mb-2">Great news! Your heart health looks good.</p>
          <p className="text-lg mb-4">No alerts to display at the moment.</p>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300">Check Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-100 to-blue-200">
      <h2 className="text-3xl font-bold mb-6 text-purple-800">Heart Health Alerts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ecgData.map((data, index) => (
          <div key={index} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getAlertBorderColor(data.afibClassification)}`}>
            <h3 className="text-xl font-semibold mb-2 text-purple-600">{getAlertTitle(data.afibClassification)}</h3>
            <p className="mb-2">Date: <span className="font-medium">{new Date(data.startTimestamp.$date).toLocaleString()}</span></p>
            <p className="mb-2">Average Heart Rate: <span className="font-medium">{data.avgHrBpm} BPM</span></p>
            <p className="text-sm">{getAlertMessage(data.afibClassification, data.avgHrBpm)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const getAlertBorderColor = (afibClassification) => {
  switch (afibClassification) {
    case "0": return "border-green-500";
    case "1": return "border-yellow-500";
    case "2": return "border-red-500";
    default: return "border-blue-500";
  }
};

const getAlertTitle = (afibClassification) => {
  switch (afibClassification) {
    case "0": return "Normal Heart Rhythm";
    case "1": return "Possible AFib Detected";
    case "2": return "AFib Alert";
    default: return "Heart Health Update";
  }
};

const getAlertMessage = (afibClassification, avgHrBpm) => {
  switch (afibClassification) {
    case "0":
      return `Your heart rhythm appears normal. Your average heart rate was ${avgHrBpm} BPM.`;
    case "1":
      return `Possible irregular heart rhythm detected. Average heart rate: ${avgHrBpm} BPM. Consider consulting your doctor.`;
    case "2":
      return `Atrial fibrillation (AFib) detected. Average heart rate: ${avgHrBpm} BPM. Please consult your healthcare provider immediately.`;
    default:
      return `Unusual heart activity detected. Average heart rate: ${avgHrBpm} BPM. Please monitor your condition.`;
  }
};

export default Alerts;