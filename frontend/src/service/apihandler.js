import axios from 'axios';
import { toast } from 'react-toastify';



const API_URL = import.meta.env.VITE_APP_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
export const signin = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      toast.success("Login Successful!");
      return response.data;
    } catch (error) {
      console.error('Signin error:', error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
      throw error;
    }
  };
  
  export const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      toast.success("Registration Successful!");
      return response;
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      throw error;
    }
  };

export const getActivty=async()=>{
    try {
        
    } catch (error) {
        console.error(error);
    }
}

export const getHealthData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.token) {
        throw new Error('No authentication token found');
      }
  
      const response = await api.get('/getHealthData', {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching health data:', error);
      toast.error(error.response?.data?.message || "Failed to fetch health data. Please try again.");
      throw error;
    }
  };

export const getActivityData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.token) {
        throw new Error('No authentication token found');
      }
  
      const response = await api.get('/getActivitydata', {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching health data:', error);
      toast.error(error.response?.data?.message || "Failed to fetch health data. Please try again.");
      throw error;
    }
  };
export const getBodyData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.token) {
        throw new Error('No authentication token found');
      }
  
      const response = await api.get('/getBodyData', {
        headers: {
          Authorization: `Bearer ${userData.token}`
        }
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching health data:', error);
      toast.error(error.response?.data?.message || "Failed to fetch health data. Please try again.");
      throw error;
    }
  };

  export const getScoreboardData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.token) {
        throw new Error('No authentication token found');
      }
  
      const response = await api.get('/getScoreboard', {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      // console.log(response.data,"data");
  
      return response.data;
    } catch (error) {
      console.error('Error fetching scoreboard data:', error);
      throw error;
    }
  };



  export const updateTerraApi = async (userId) => {
    try {
      const response = await api.put(`/updateTerraId/${userId}`);
      // console.log(response.data, "data");
      return response.data;
    } catch (error) {
      console.error('Error Updating data:', error);
      throw error;
    }
  };

  export const getSleepData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData || !userData.token) {
        throw new Error('No authentication token found');
      }
  
      const response = await api.get('/getSleepData', {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
     
  
      return response.data;
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      throw error;
    }
  };