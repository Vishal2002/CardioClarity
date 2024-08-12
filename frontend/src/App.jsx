import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Alerts from './pages/Alerts';
import Activity from './pages/Activity';
import Sleep from './pages/Sleep';
import Body from './pages/Body';
import Scoreboard from './pages/Scoreboard';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import AuthLayout from './components/AuthLayout';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const data={
  "_id": {
    "$oid": "66b5c5e3fde03fa2f98d082c"
  },
  "userId": {
    "$oid": "66b3b66665291912dc04eaed"
  },
  "ecgData": [
    {
      "startTimestamp": {
        "$date": "2024-08-09T08:36:46.038Z"
      },
      "avgHrBpm": 50,
      "afibClassification": "2",
      "_id": {
        "$oid": "66b5c5e3fde03fa2f98d082d"
      }
    },
    {
      "startTimestamp": {
        "$date": "2024-08-10T02:56:46.038Z"
      },
      "avgHrBpm": 114,
      "afibClassification": "0",
      "_id": {
        "$oid": "66b5c5e3fde03fa2f98d082e"
      }
    },
    {
      "startTimestamp": {
        "$date": "2024-08-10T06:56:46.038Z"
      },
      "avgHrBpm": 97,
      "afibClassification": "1",
      "_id": {
        "$oid": "66b5c5e3fde03fa2f98d082f"
      }
    }
  ],
  "heartRateData": {
    "avgHrBpm": 122.07029746293223,
    "maxHrBpm": 58.018619010960236,
    "minHrBpm": 123.42720543216966,
    "restingHrBpm": 51.70725092877664,
    "avgHrvRmssd": 93.50634436308695
  },
  "oxygenData": {
    "avgSaturationPercentage": 30,
    "vo2Max": 30
  },
  "bodyMeasurements": [
    {
      "measurementTime": {
        "$date": "2024-08-09T07:31:46.038Z"
      },
      "weightKg": 66.31776440416675,
      "bmi": 21.73359127590084,
      "bodyfatPercentage": 28.631054131483204,
      "_id": {
        "$oid": "66b5c5e3fde03fa2f98d0830"
      }
    },
    {
      "measurementTime": {
        "$date": "2024-08-09T13:31:46.038Z"
      },
      "weightKg": 94.43126924922893,
      "bmi": 22.39796530876606,
      "bodyfatPercentage": 33.17870880921735,
      "_id": {
        "$oid": "66b5c5e3fde03fa2f98d0831"
      }
    },
    {
      "measurementTime": {
        "$date": "2024-08-09T16:31:46.038Z"
      },
      "weightKg": 99.12069794232137,
      "bmi": 18.231181972261645,
      "bodyfatPercentage": 34.46996287989839,
      "_id": {
        "$oid": "66b5c5e3fde03fa2f98d0832"
      }
    },
    {
      "measurementTime": {
        "$date": "2024-08-09T19:31:46.038Z"
      },
      "weightKg": 54.338451721125935,
      "bmi": 19.546292732018138,
      "bodyfatPercentage": 75.02513877185997,
      "_id": {
        "$oid": "66b5c5e3fde03fa2f98d0833"
      }
    }
  ],
  "createdAt": {
    "$date": "2024-08-09T07:31:47.020Z"
  },
  "updatedAt": {
    "$date": "2024-08-09T07:31:47.020Z"
  },
  "__v": 0
}



function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Route>

        {/* Main app routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/alerts" element={<Alerts ecgData={data.ecgData} />} />
          <Route path="/sleep" element={<Sleep  />} />
          <Route path="/body" element={<Body />} />
          <Route path="/scoreboard" element={<Scoreboard/>} />
        </Route>
      </Routes>
      <ToastContainer/>
    </BrowserRouter>

  );
}

export default App;
