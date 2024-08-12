const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    type: String,
    startTime: Date,
    endTime: Date,
    heartRate: {
      resting: Number,
      average: Number,
      max: Number,
      min: Number,
      samples: [{
        timestamp: Date,
        bpm: Number
      }]
    },
    distance: Number,
    steps: Number,
    calories: Number,
    elevation: {
      max: Number,
      average: Number
    }
  });

const emergencyContactSchema = new mongoose.Schema({
  name: String,
  relationship: String,
  phone: String
});


const healthScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  overallScore: { type: Number, required: true },
  componentScores: {
    heartScore: Number,
    sleepScore: Number,
    oxygenScore: Number,
    hrvScore: Number,
    stressScore: Number
  },
 feedback: {
    overallSummary: String,
    componentFeedback: {
      heart: String,
      sleep: String,
      oxygen: String,
      hrv: String,
      stress: String
    },
    recommendations: [String],
    motivationalMessage: String
  },
  timestamp: { type: Date, default: Date.now },
  alertSent: { type: Boolean, default: false }
});



const healthDataSchema = new mongoose.Schema({
  heart: {
    avgHeartRate: Number,
    restingHeartRate: Number,
    minHeartRate: Number,
    maxHeartRate: Number,
    avgHRV: Number
  },
  sleep: {
    totalSleepDuration: Number,
    lightSleepDuration: Number,
    deepSleepDuration: Number,
    remSleepDuration: Number,
    sleepEfficiency: Number,
    awakeTime: Number,
    sleepLatency: Number
  },
  oxygen: {
    avgSaturationPercentage: Number,
    vo2Max: Number
  },
  respiration: {
    avgBreathRate: Number,
    avgOxygenSaturation: Number
  },
  stress: Number,
  timestamp: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String,required: true},
  age: { type: Number },
  gender: { type: String },
  email: { type: String,unique: true,required: true},
  password: { type: String,required: true},
  activities: [activitySchema],
  latestHealthData: healthDataSchema,
  healthDataHistory: [healthDataSchema],
  latestRiskScore: { type: Number, default:6},
  terraUserId:{type:String, default:undefined},
  terraResource: {type:String},
  alertsEnabled: { type: Boolean, default: true },
  provider: { type: String }
},{timestamps:true});

// SleepData Schema
const SleepDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  heartRate: {
    avgHeartRate: Number,
    restingHeartRate: Number,
    minHeartRate: Number,
    maxHeartRate: Number,
    avgHRV: Number
  },
  sleepDuration: {
    totalSleepDuration: Number,
    lightSleepDuration: Number,
    deepSleepDuration: Number,
    remSleepDuration: Number,
    sleepEfficiency: Number,
    awakeTime: Number,
    sleepLatency: Number
  },
  respiration: {
    avgBreathRate: Number,
    avgOxygenSaturation: Number
  },
  temperatureDelta: Number,
  startTime: Date,
  endTime: Date
},{timestamps:true});

const BodyDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ecgData: [
    {
      startTimestamp: Date,
      avgHrBpm: Number,
      afibClassification: String,
    }
  ],
  heartRateData: {
    avgHrBpm: Number,
    maxHrBpm: Number,
    minHrBpm: Number,
    restingHrBpm: Number,
    avgHrvRmssd: Number,
  },
  oxygenData: {
    avgSaturationPercentage: Number,
    vo2Max: Number
  },
  bodyMeasurements: [
    {
      measurementTime: Date,
      weightKg: Number,
      bmi: Number,
      bodyfatPercentage: Number
    }
  ]
},{timestamps:true});

const ActivityDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  heartRate: {
    resting: Number,
    average: Number,
    max: Number,
    min: Number,
  },
  distance: { type: Number, required: true },
  steps: { type: Number, required: true },
  calories: { type: Number, required: true },
  elevation: {
    max: Number,
    average: Number
  }
},{timestamps:true});

const ActivityData = mongoose.model('ActivityData', ActivityDataSchema);

const BodyData = mongoose.model('BodyData', BodyDataSchema);


const SleepData=mongoose.model('Sleep', SleepDataSchema);
const User = mongoose.model('User', userSchema);
const HealthScore = mongoose.model('HealthScore', healthScoreSchema);
const HealthData = mongoose.model('HealthData', healthDataSchema);

module.exports = { User, HealthScore, HealthData,SleepData,ActivityData,BodyData};