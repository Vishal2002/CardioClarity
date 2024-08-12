const jwt = require('jsonwebtoken');
const { default: Terra } = require("terra-api");
const { config } = require('dotenv');
const mongoose=require('mongoose');
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const {User,HealthScore,healthDataHistory,ActivityData,SleepData,BodyData}=require('./db')
const { processTerradata, calculateOverallHeartRiskScore, sendAlert, heartScore,HRVScore, sleepScore, stressScore,oxygenScore } = require("./helper");
const {generateFeedback}=require('./genai/genai');
const axios = require('axios');

config();

const RISK_THRESHOLD = 5; 

if (!process.env.TERRA_DEV_ID || !process.env.TERRA_API_KEY || !process.env.TERRA_WEBHOOK_SECRET || !process.env.MONGODB_URI) {
  console.error("Missing required environment variables");
  process.exit(1);
}


const terra = new Terra(process.env.TERRA_DEV_ID, process.env.TERRA_API_KEY, process.env.TERRA_WEBHOOK_SECRET);



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({message:"Login Success", token, userId: user._id,name: user.name,email: user.email});
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    newUser.userId = uuidv4();
    await newUser.save();

    const terraSession = await terra.generateWidgetSession(
      newUser.userId,
      ["FITBIT"],
      "EN",
      "http://localhost:5173/signin",
      "http://localhost:5173/signup"
    );

    if (terraSession.status === "success") {
      res.status(201).json({
        message: "User Registered",
        data: newUser,
        terraWidgetUrl: terraSession.url
      });
    } else {
      res.status(500).json({ error: "Failed to generate Terra widget session" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};


exports.updateUserTerraId = async (req, res) => {
  try {
   
    const userId = req.params.userId;
    const options = {
  method: 'GET',
  url: `https://api.tryterra.co/v2/userInfo?reference_id=${userId}`,
  headers: {
    accept: 'application/json',
    'dev-id': process.env.TERRA_DEV_ID,
    'x-api-key': process.env.TERRA_API_KEY
  }
};
    const{data}=await axios.request(options);
    // console.log(data,"date from request");
    const user = await User.findByIdAndUpdate(userId, { terraUserId:data.users[0]?.user_id }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User updated with Terra ID', data: user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};


exports.consumeTerraWebhook = async (req, res) => {
  res.sendStatus(200);

  const data = req.body;
  console.log(data.user.user_id);
  const allUsers = await User.find({});
console.log("All users:", allUsers);
  const user = await User.findOne({terraUserId:data.user.user_id });
  console.log(user,"date from request");
  
  try {
    if (data.type === 'activity' && data.data) {
      const activityData = new ActivityData({
        userId: user._id,
        type: data.data[0].metadata.name,
        startTime: new Date(data.data[0].metadata.start_time),
        endTime: new Date(data.data[0].metadata.end_time),
        heartRate: {
          resting: data.data[0].heart_rate_data.summary.resting_hr_bpm,
          average: data.data[0].heart_rate_data.summary.avg_hr_bpm,
          max: data.data[0].heart_rate_data.summary.max_hr_bpm,
          min: data.data[0].heart_rate_data.summary.min_hr_bpm,
        },
        distance: data.data[0].distance_data.summary.distance_meters,
        steps: data.data[0].distance_data.summary.steps,
        calories: data.data[0].calories_data.net_activity_calories,
        elevation: {
          max: data.data[0].distance_data.summary.elevation.max_meters,
          average: data.data[0].distance_data.summary.elevation.avg_meters
        }
      });
      await activityData.save();
    }

    if (data.type === 'sleep' && data.data) {
      const sleepData = new SleepData({
        userId: user._id,
        heartRate: {
          avgHeartRate: data.data[0].heart_rate_data.summary.avg_hr_bpm,
          restingHeartRate: data.data[0].heart_rate_data.summary.resting_hr_bpm,
          minHeartRate: data.data[0].heart_rate_data.summary.min_hr_bpm,
          maxHeartRate: data.data[0].heart_rate_data.summary.max_hr_bpm,
          avgHRV: data.data[0].heart_rate_data.summary.avg_hrv_rmssd
        },
        sleepDuration: {
          totalSleepDuration: data.data[0].sleep_durations_data.asleep.duration_asleep_state_seconds,
          lightSleepDuration: data.data[0].sleep_durations_data.asleep.duration_light_sleep_state_seconds,
          deepSleepDuration: data.data[0].sleep_durations_data.asleep.duration_deep_sleep_state_seconds,
          remSleepDuration: data.data[0].sleep_durations_data.asleep.duration_REM_sleep_state_seconds,
          sleepEfficiency: data.data[0].sleep_durations_data.sleep_efficiency,
          awakeTime: data.data[0].sleep_durations_data.awake.duration_awake_state_seconds,
          sleepLatency: data.data[0].sleep_durations_data.awake.sleep_latency_seconds
        },
        respiration: {
          avgBreathRate: data.data[0].respiration_data.breaths_data.avg_breaths_per_min,
          avgOxygenSaturation: data.data[0].respiration_data.oxygen_saturation_data.avg_saturation_percentage
        },
        temperatureDelta: data.data[0].temperature_data.delta,
        startTime: new Date(data.data[0].metadata.start_time),
        endTime: new Date(data.data[0].metadata.end_time)
      });
      await sleepData.save();
    }

    if (data.type === 'body' && data.data) {
      const bodyData = new BodyData({
        userId: user._id,
        ecgData: data.data[0].heart_data.ecg_signal.map(signal => ({
          startTimestamp: signal.start_timestamp,
          avgHrBpm: signal.avg_hr_bpm,
          afibClassification: signal.afib_classification,
          rawSignal: signal.raw_signal
        })),
        heartRateData: {
          avgHrBpm: data.data[0].heart_data.heart_rate_data.summary.avg_hr_bpm,
          maxHrBpm: data.data[0].heart_data.heart_rate_data.summary.max_hr_bpm,
          minHrBpm: data.data[0].heart_data.heart_rate_data.summary.min_hr_bpm,
          restingHrBpm: data.data[0].heart_data.heart_rate_data.summary.resting_hr_bpm,
          avgHrvRmssd: data.data[0].heart_data.heart_rate_data.summary.avg_hrv_rmssd,
          hrSamples: data.data[0].heart_data.heart_rate_data.detailed.hr_samples
        },
        oxygenData: {
          avgSaturationPercentage: data.data[0].oxygen_data.avg_saturation_percentage,
          saturationSamples: data.data[0].oxygen_data.saturation_samples,
          vo2Max: data.data[0].oxygen_data.vo2max_ml_per_min_per_kg
        },
        bodyMeasurements: data.data[0].measurements_data.measurements.map(measurement => ({
          measurementTime: measurement.measurement_time,
          weightKg: measurement.weight_kg,
          bmi: measurement.BMI,
          bodyfatPercentage: measurement.bodyfat_percentage
        }))
      });
      await bodyData.save();
    }

   
  } catch (err) {
    console.error("Error processing webhook data:", err);
  }
};



exports.getActivitydata=async (req,res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


exports.getHealthdata = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    // Fetch activity data
    const activityData = await ActivityData.findOne({
      userId: userId,
      startTime: { $gte: todayStart, $lte: todayEnd }
    }).sort({ startTime: -1 }).select('steps startTime -_id');

    // Fetch body data
    const bodyData = await BodyData.findOne({
      userId: userId,
      'bodyMeasurements.measurementTime': { $gte: todayStart, $lte: todayEnd }
    }).sort({ 'bodyMeasurements.measurementTime': -1 }).select('bodyMeasurements -_id');

    // Fetch health score
    const healthScore = await HealthScore.findOne({
      userId: userId,
      timestamp: { $gte: todayStart, $lte: todayEnd }
    }).sort({ createdAt: -1 });
    
    //  console.log(healthScore);
 
    // Fetch sleep data
    const sleepData = await SleepData.findOne({
      userId: userId,
      startTime: { $gte: todayStart, $lte: todayEnd }
    }).sort({ startTime: -1 }).select('sleepDuration.totalSleepDuration -_id');

    // Combine the data
    const combinedData = {
      totalSteps: activityData?.steps || null,
      date: activityData ? moment(activityData.startTime).format('DD-MM-YYYY') : null,
      weight: bodyData?.bodyMeasurements[bodyData.bodyMeasurements.length - 1]?.weightKg || null,
      heartScore: healthScore?.overallScore || 6,
      sleepDuration: sleepData?.sleepDuration?.totalSleepDuration || null
    };

    // Check if we have any data
    if (Object.values(combinedData).every(value => value === null)) {
      return res.status(404).json({ message: "No health data found for today" });
    }

    res.status(200).json({
      data: combinedData,
      message: "Successfully fetched today's health data"
    });

  } catch (error) {
    console.error("Error in getHealthdata:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getScoreboard = async (req, res) => {
  try {
  
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const scoreboard = await HealthScore.findOne({ userId })
      .sort({ timestamp: -1 })
      .lean();
    if (!scoreboard) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({ data: scoreboard, message: "Successfully Fetched Scoreboard" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.getActivitydata = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const activityData = await ActivityData.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    if (!activityData || activityData.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({ data: activityData, message: "Successfully Fetched Activity Data" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSleepData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const sleepdata = await SleepData.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!sleepdata) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({ data:sleepdata, message: "Successfully Fetched Body Data" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBodyData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const bodydata = await BodyData.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!bodydata) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json({ data:bodydata, message: "Successfully Fetched Body Data" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.calculateAndStoreScore = async (userId) => {
  try {
    const user = await User.findById(userId);
    const latestActivityData = await ActivityData.findOne({ userId }).sort({ createdAt: -1 }).limit(1).lean();
    const latestSleepData = await SleepData.findOne({ userId }).sort({ createdAt: -1 }).limit(1).lean();
    const latestBodyData = await BodyData.findOne({ userId }).sort({ createdAt: -1 }).limit(1).lean();

    console.log(latestActivityData,"Activity");
    console.log(latestBodyData,"Body");
    console.log(latestSleepData,"Sleep");

    // Calculate the overall risk score and component scores using the latest data
    const { overallRiskScore, componentScores } = await calculateOverallHeartRiskScore(
      user,
      latestActivityData,
      latestSleepData,
      latestBodyData
    );
    console.log("Before ai feedback: " );
    const aiFeedback = await generateFeedback(componentScores, overallRiskScore);
    console.log(aiFeedback,"feedback");
    // Create and save a new HealthScore
    const healthScore = new HealthScore({
      userId: user._id,
      overallScore: overallRiskScore,
      componentScores: componentScores,
      feedback: aiFeedback 
    });
    await healthScore.save();
    user.latestRiskScore=overallRiskScore;
    await user.save()
  
    if (overallRiskScore < RISK_THRESHOLD) {
      await sendAlert(user, overallRiskScore); 
    }

    return {
      overallRiskScore,
      componentScores,
      feedback: aiFeedback
    };
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};



