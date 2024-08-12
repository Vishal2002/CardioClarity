import axios from 'axios';

const TERRA_API_URL = "https://api.tryterra.co/v2";
const TERRA_DEV_ID = 'hope-testing-NYJsVlDNp5';
const TERRA_API_KEY = 'RGGRJ9lArCkGUtv0FNbuJodWnQZ1Yyrq';



// tryterra.auth('RGGRJ9lArCkGUtv0FNbuJodWnQZ1Yyrq');
// tryterra.generateWidgetSession({
//   providers: 'FITBIT',
//   reference_id: '',
//   auth_success_redirect_url: 'string',
//   auth_failure_redirect_url: 'string',
//   language: 'en',
//   show_disconnect: true,
//   use_terra_avengers_app: false
// }, {'dev-id': 'hope-testing-NYJsVlDNp5'})
//   .then(({ data }) => console.log(data))
//   .catch(err => console.error(err));

//   export const generateTerraWidgetSession=async(userId)=>{
    
//         tryterra.auth('RGGRJ9lArCkGUtv0FNbuJodWnQZ1Yyrq');
//         tryterra.generateWidgetSession({
//           providers: 'FITBIT',
//           reference_id: userId,
//           auth_success_redirect_url: 'http://localhost:5173/signin',
//           auth_failure_redirect_url: 'http://localhost:5173/signup',
//           language: 'en',
//           show_disconnect: true,
//           use_terra_avengers_app: false
//         }, {'dev-id': 'hope-testing-NYJsVlDNp5'})
//           .then(({ data }) => console.log(data))
//           .catch(err => console.error(err));
        

//   }

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