const nodemailer = require('nodemailer');
const {SleepData,ActivityData,BodyData}=require('./db.js')
function processTerradata(data, userAge) {
  let processedData = {};
  let riskScore;

  if (data.type === 'activity' && data.data) {
    processedData = { ...processedData, ...processActivityData(data) };
  }
  if (data.type === 'sleep' && data.data) {
    processedData = { ...processedData, ...processSleepData(data) };
  }
  if (data.type === 'body' && data.data) {
    processedData = { ...processedData, ...processbodyData(data) };
  }

  riskScore = calculateOverallHeartRiskScore(processedData, userAge);

  return {
    processedData,
    riskScore
  };
}
async function calculateOverallHeartRiskScore(user, latestActivityData, latestSleepData, latestBodyData) {
  let componentScores = {};
  let factorsCount = 0;

  // console.log('User:', user);
  // console.log('Latest Activity Data:', latestActivityData);
  // console.log('Latest Sleep Data:', latestSleepData);
  // console.log('Latest Body Data:', latestBodyData);

  // Sleep risk score
  if (latestSleepData) {
    // console.log('Calculating sleep risk score');
    componentScores.sleepScore = calculateSleepRiskScore(latestSleepData, user.age);
    // console.log('Sleep risk score:', componentScores.sleepScore);
    factorsCount++;
  }

  // Activity risk score
  if (latestActivityData) {
    // console.log('Calculating activity risk score');
    componentScores.heartScore = calculateActivityRiskScore(latestActivityData, user.age);
    // console.log('Activity risk score:', componentScores.heartScore);
    factorsCount++;
  }

  // Body risk scores
  if (latestBodyData) {
    // console.log('Calculating body risk scores');
    componentScores.oxygenScore = oxygenScore(latestBodyData.oxygenData);
    componentScores.hrvScore = HRVScore(latestBodyData.heartRateData.avgHrvRmssd);
    componentScores.stressScore = stressScore({
      hrv: latestBodyData.heartRateData.avgHrvRmssd,
      restingHR: latestBodyData.heartRateData.restingHrBpm
    });
    // console.log('Oxygen score:', componentScores.oxygenScore);
    // console.log('HRV score:', componentScores.hrvScore);
    // console.log('Stress score:', componentScores.stressScore);
    factorsCount += 3; // Counting oxygen, HRV, and stress as separate factors
  }

  // Calculate overall risk score
  let overallRiskScore;
  if (factorsCount > 0) {
    const sumOfScores = Object.values(componentScores).reduce((sum, score) => sum + score, 0);
    overallRiskScore = Math.round(Math.max(0, Math.min(10, sumOfScores / factorsCount)));
  } else {
    overallRiskScore = 5; // Default risk score if no data is available
  }

  // console.log('Overall risk score:', overallRiskScore);
  // console.log('Component scores:', componentScores);

  return { overallRiskScore, componentScores };
}
function calculateActivityRiskScore(data, userAge) {
  let score = 5; // Start with a neutral score

  // Heart rate scoring
  score += heartScore(data.heartRate);

  // Activity intensity scoring
  if (data.heartRate.average > 120) score += 1;
  if (data.steps > 10000) score += 1;

  // Age factor
  if (userAge > 40) score -= 1;
  if (userAge > 50) score -= 2;

  return Math.max(0, Math.min(10, score));
}

function calculateSleepRiskScore(data, userAge) {
  let score = 5; // Start with a neutral score

  // Sleep scoring
  score += sleepScore(data.sleepDuration);

  // Heart rate during sleep
  score += heartScore(data.heartRate);

  // Respiration scoring
  if (data.respiration.avgBreathRate < 12 || data.respiration.avgBreathRate > 20) score -= 1;
  if (data.respiration.avgOxygenSaturation < 95) score -= 2;

  // Age factor
  if (userAge > 40) score -= 1;
  if (userAge > 50) score -= 2;

  return Math.max(0, Math.min(10, score));
}

function calculateBodyRiskScore(data, userAge) {
  let score = 5; // Start with a neutral score
  //  console.log(data,"data from body risk");
  // Heart scoring
  score += heartScore(data.heartRateData);

  // Oxygen scoring
  score += oxygenScore(data.oxygenData);

  // BMI scoring
  const latestMeasurement = data.bodyMeasurements[data.bodyMeasurements.length - 1];
  if (latestMeasurement.bmi < 18.5 || latestMeasurement.bmi > 25) score -= 1;
  if (latestMeasurement.bmi > 30) score -= 2;

  // Age factor
  if (userAge > 40) score -= 1;
  if (userAge > 50) score -= 2;

  return Math.max(0, Math.min(10, score));
}

async function sendAlert(user, riskScore) {
  // console.log(`Alert: High risk score (${riskScore}) for user ${user.name}`);

  // Create a transporter using SMTP
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'dennis30@ethereal.email',
      pass: 'tvXJryxYVarEeG2DVF'
    }
  });

  let info = await transporter.sendMail({
    from: 'dennis30@ethereal.email',
    to: user.email,
    subject: "High Heart Health Risk Detected",
    text: `Dear ${user.name}, Our system has detected a high risk score of ${riskScore}...`,
    html: `<p>Dear ${user.name},</p><p>Our system has detected a high risk score of <strong>${riskScore}</strong>...</p>`,
  });

  // console.log("Message sent: %s", info.messageId);
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

function processActivityData(data) {
  const activity = data.data[0];
  return {
    type: activity.metadata.name,
    startTime: new Date(activity.metadata.start_time),
    endTime: new Date(activity.metadata.end_time),
    heartRate: {
      resting: activity.heart_rate_data.summary.resting_hr_bpm,
      average: activity.heart_rate_data.summary.avg_hr_bpm,
      max: activity.heart_rate_data.summary.max_hr_bpm,
      min: activity.heart_rate_data.summary.min_hr_bpm,
      samples: activity.heart_rate_data.detailed.hr_samples
    },
    distance: activity.distance_data.summary.distance_meters,
    steps: activity.distance_data.summary.steps,
    calories: activity.calories_data.net_activity_calories,
    elevation: {
      max: activity.distance_data.summary.elevation.max_meters,
      average: activity.distance_data.summary.elevation.avg_meters
    }
  }
}

function processSleepData(data) {
  const sleepData = data;

  // console.log("sleep", sleepData.data[0].metadata, "sleep");

  // Extract relevant data
  const heartRateData = sleepData.data[0].heart_rate_data.summary;
  const sleepDurationsData = sleepData.data[0].sleep_durations_data;
  const respirationData = sleepData.data[0].respiration_data;
  const temperatureData = sleepData.data[0].temperature_data;
  // Process and return key metrics

  return {
    heartRate: {
      avgHeartRate: heartRateData.avg_hr_bpm,
      restingHeartRate: heartRateData.resting_hr_bpm,
      minHeartRate: heartRateData.min_hr_bpm,
      maxHeartRate: heartRateData.max_hr_bpm,
      avgHRV: heartRateData.avg_hrv_rmssd
    },
    sleepDuration: {
      totalSleepDuration: sleepDurationsData.asleep.duration_asleep_state_seconds,
      lightSleepDuration: sleepDurationsData.asleep.duration_light_sleep_state_seconds,
      deepSleepDuration: sleepDurationsData.asleep.duration_deep_sleep_state_seconds,
      remSleepDuration: sleepDurationsData.asleep.duration_REM_sleep_state_seconds,
      sleepEfficiency: sleepDurationsData.sleep_efficiency,
      awakeTime: sleepDurationsData.awake.duration_awake_state_seconds,
      sleepLatency: sleepDurationsData.awake.sleep_latency_seconds
    },
    respiration: {
      avgBreathRate: respirationData.breaths_data.avg_breaths_per_min,
      avgOxygenSaturation: respirationData.oxygen_saturation_data.avg_saturation_percentage
    },
    temperatureDelta: temperatureData.delta,
    startTime: sleepData.data[0].metadata.start_time,
    endTime: sleepData.data[0].metadata.end_time
  };
}

function processbodyData(data) {
  const bodyData = data;
  // console.log(bodyData, "bodyData");
  const heartData = bodyData.data[0].heart_data;
  const oxygenData = bodyData.data[0].oxygen_data;
  // console.log(oxygenData, "oxygenData");
  const measurementsData = bodyData.data[0].measurements_data.measurements;
  // console.log(heartData, "heart_data");
  return {
    ecgData: heartData.ecg_signal.map(signal => ({
      startTimestamp: signal.start_timestamp,
      avgHrBpm: signal.avg_hr_bpm,
      afibClassification: signal.afib_classification,
      rawSignal: signal.raw_signal
    })),
    heartRateData: {
      avgHrBpm: heartData.heart_rate_data.summary.avg_hr_bpm,
      maxHrBpm: heartData.heart_rate_data.summary.max_hr_bpm,
      minHrBpm: heartData.heart_rate_data.summary.min_hr_bpm,
      restingHrBpm: heartData.heart_rate_data.summary.resting_hr_bpm,
      avgHrvRmssd: heartData.heart_rate_data.summary.avg_hrv_rmssd,
      hrSamples: heartData.heart_rate_data.detailed.hr_samples
    },
    oxygenData: {
      avgSaturationPercentage: oxygenData.avg_saturation_percentage,
      saturationSamples: oxygenData.saturation_samples,
      vo2Max: oxygenData.vo2max_ml_per_min_per_kg
    },
    bodyMeasurements: measurementsData.map(measurement => ({
      measurementTime: measurement.measurement_time,
      weightKg: measurement.weight_kg,
      bmi: measurement.BMI,
      bodyfatPercentage: measurement.bodyfat_percentage
    }))
  };
}

function heartScore(data) {
  // console.log(data, "heartScore data");
  if (!data) {
    // console.log("No heart rate data available for scoring");
    return null;
  }

  let score = 5; // Start with a neutral score
  const heartRate = data;
  // console.log("heartRate:", heartRate);

  // Check resting heart rate
  if (heartRate.restingHrBpm !== undefined) {
    if (heartRate.restingHrBpm < 60) score += 2;
    else if (heartRate.restingHrBpm < 70) score += 1;
    else if (heartRate.restingHrBpm > 100) score -= 2;
  }

  // Check average heart rate
  if (heartRate.avgHrBpm !== undefined) {
    if (heartRate.avgHrBpm > 100) score -= 1;
    if (heartRate.avgHrBpm > 120) score -= 2;
  }

  // Check max heart rate
  if (heartRate.maxHrBpm !== undefined) {
    if (heartRate.maxHrBpm > 180) score -= 2;
  }

  // Heart rate variability
  if (heartRate.avgHrvRmssd !== undefined) {
    if (heartRate.avgHrvRmssd < 20) score -= 2;
    else if (heartRate.avgHrvRmssd > 50) score += 2;
  }
  // console.log(Math.max(0, Math.min(10, score)));
  return Math.max(0, Math.min(10, score));
}

function sleepScore(data) {
  if (!data || typeof data.totalSleepDuration === 'undefined') {
    // console.log("Insufficient sleep data for scoring");
    return null;
  }

  let score = 5; // Start with a neutral score
  // console.log(data, "sleepScore");
  // Total sleep duration
  const totalSleepHours = data.totalSleepDuration / 3600;
  if (totalSleepHours >= 7 && totalSleepHours <= 9) score += 2;
  else if (totalSleepHours < 6 || totalSleepHours > 10) score -= 2;

  // Sleep efficiency
  if (data.sleepEfficiency > 85) score += 2;
  else if (data.sleepEfficiency < 70) score -= 2;

  // Deep sleep
  if (data.deepSleepDuration && data.totalSleepDuration) {
    const deepSleepPercentage = (data.deepSleepDuration / data.totalSleepDuration) * 100;
    if (deepSleepPercentage > 20) score += 1;
    else if (deepSleepPercentage < 10) score -= 1;
  }

  // REM sleep
  if (data.remSleepDuration && data.totalSleepDuration) {
    const remSleepPercentage = (data.remSleepDuration / data.totalSleepDuration) * 100;
    if (remSleepPercentage > 20 && remSleepPercentage < 25) score += 1;
    else if (remSleepPercentage < 15 || remSleepPercentage > 30) score -= 1;
  }

  return Math.max(0, Math.min(10, score));
}

function oxygenScore(data) {
 
  let score = 5;
  const oxygen = data;
  // console.log("oxygen",data);
  if (!oxygen || typeof oxygen.avgSaturationPercentage === 'undefined') {
    // console.log("Insufficient oxygen data for scoring");
    return null;
  }

  // Average oxygen saturation
  if (oxygen.avgSaturationPercentage >= 95) score += 3;
  else if (oxygen.avgSaturationPercentage >= 90) score += 1;
  else if (oxygen.avgSaturationPercentage < 90) score -= 3;
  else{
    return ;
  }

  if (oxygen.vo2Max) {
    if (oxygen.vo2Max > 40) score += 2;
    else if (oxygen.vo2Max > 30) score += 1;
    else score -= 1;
  }

  return Math.max(0, Math.min(10, score));
}

function HRVScore(data) {
  let score = 5;
  const hrv = data;

  if (hrv > 100) score += 5;
  else if (hrv > 50) score += 3;
  else if (hrv > 30) score += 1;
  else if (hrv < 20) score -= 2;
  else if (hrv < 10) score -= 4;

  return Math.max(0, Math.min(10, score));
}

function stressScore(data) {
  let score = 5;
  const hrv = data.hrv;
  const restingHR = data.restingHR;

  // HRV component
  if (hrv > 100) score += 2;
  else if (hrv < 20) score -= 2;

  // Resting heart rate component
  if (restingHR < 60) score += 2;
  else if (restingHR > 80) score -= 2;

  return Math.max(0, Math.min(10, score));
}


function generateFeedback(score) {
  // Implement logic to generate feedback based on the score
  // This can be expanded later with AI-generated feedback
  if (score < 4) return "Your heart health risk is high. Please consult a doctor immediately.";
  if (score < 7) return "Your heart health could use some improvement. Consider lifestyle changes.";
  return "Your heart health looks good. Keep up the healthy habits!";
}


module.exports = {
  sendAlert,
  processTerradata,
  heartScore,
  processActivityData,
  processSleepData,
  processbodyData,
  stressScore,
  sleepScore,
  HRVScore,
  oxygenScore,
  generateFeedback,
  calculateOverallHeartRiskScore
}