import React, { useEffect, useState } from 'react';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBodyData } from './service/apihandler';

function App() {
  const [ecgData, setEcgData] = useState([]);

  useEffect(() => {
    const fetchBodyData = async () => {
      try {
        const data = await getBodyData();
        setEcgData(data.data.ecgData || []);
      } catch (error) {
        console.error("Error fetching body data:", error);
      }
    };

    fetchBodyData();
  }, []);

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
          <Route path="/alerts" element={<Alerts ecgData={ecgData} />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/body" element={<Body />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;