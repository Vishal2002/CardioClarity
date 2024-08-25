import axios from 'axios';




export const generateTerraWidgetSession = async (userId) => {
  try {
    const response = await axios.post(`${TERRA_API_URL}/auth/generateWidgetSession`, {
      reference_id: userId,
      lang: 'en',
      authSuccessRedirectUrl:"http://localhost:5173/signin",
      authFailureRedirectUrl: "http://localhost:5173/signup"
    }, {
      headers: {
        'dev-id': TERRA_DEV_ID,
        'x-api-key': TERRA_API_KEY,
        'Content-Type': 'application/json'
      },

    });
    
    if (response.data && response.data.status === 'success') {
        return response.data;
      } else {
        throw new Error('Failed to generate widget session');
      }
  } catch (error) {
    console.error('Error generating Terra widget session:', error.response?.data || error.message);
    throw error;
  }
};