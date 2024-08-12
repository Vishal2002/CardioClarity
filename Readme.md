# CardioClarity: Early Heart Attack Detection System

## Motivation and Personal Story

This project is deeply personal to me. My mother, whom I love dearly, is currently battling high cholesterol, putting her at risk for heart disease. This experience opened my eyes to the broader issue: millions of Indians die each year from heart attacks, many of which could potentially be prevented with early detection and intervention.

By creating an early alert system for heart attack risk, we have the opportunity to significantly reduce heart attack deaths in India and potentially save countless lives. This project is my contribution to that vital cause.


## Problem Statement

Heart disease is a leading cause of death globally, with a particularly high impact in India. Many heart attacks occur without warning, but there are often subtle signs that, if detected early, could save lives. The challenge is to identify these early warning signs using data from everyday wearable devices.

## Innovative Solution

Our solution uses data from wearable devices to create a responsive heart attack risk assessment system. Here's what makes our approach innovative:

1. **Data Utilization**: We use continuous data streams from wearable devices (heart rate, activity levels, sleep patterns) to assess heart health.

2. **Dynamic Risk Assessment**: Our system continuously updates risk assessments based on real-time data from wearables.

3. **Personalized Baselines**: We establish individual baselines for each user, allowing for more accurate detection of personal anomalies.

4. **Scoring System**: We've developed a simple yet effective scoring system based on healthy ranges for key metrics.

5. **User-Friendly Interface**: We've designed an intuitive web app that clearly communicates risk levels and provides actionable advice to users.

6. **AI-Powered Feedback**: We incorporate generative AI to provide personalized health advice and feedback.

## Technical Implementation

### Data Processing and Analysis

- Preprocessed wearable datasets
- Performed feature engineering to create relevant metrics (e.g., heart rate variability)
- Defined healthy ranges for key metrics

### Scoring System

- Developed a point-based scoring system for risk assessment
- Implemented threshold-based alerts for potential health risks

### Web Application

- Built a responsive web interface using React.js
- Implemented a Node.js/Express backend for data processing and scoring
- Set up MongoDB for data storage
- Integrated a generative AI model for personalized health advice

## GitHub Repository Structure

```
├── frontend/
│   ├── src/
│   ├── Readme.md
│   ├── .gitignore
│   ├── public/
│   └── package.json
├── server/
│   ├── genai/genai.js
│   ├── db.js
│   ├── route.js
│   ├── controller.js
│   ├── middleware.js
│   └── server.js
├── README.md

```

## How to Run the Project

1. Clone the repository
2. Install dependencies: `npm install` in both root and client directories
3. Set up MongoDB and update connection string in server config
4. Run the backend: `npm run server`
5. In a new terminal, start the React frontend: `npm run client`

## Future Work

- Develop a comprehensive dataset through surveys and collaborations with medical institutions
- Implement machine learning models for more accurate risk prediction
- Integrate more diverse data sources (e.g., diet, stress levels)
- Develop a mobile app for easier user access
- Collaborate with medical professionals for clinical validation

## Impact and Scalability

This solution has the potential to make a significant impact:

1. **Early Intervention**: By providing early warnings, we enable users to seek medical attention before a heart attack occurs.
2. **Widespread Accessibility**: With the increasing adoption of smartphones and wearables, our solution can reach millions.
3. **Healthcare System Support**: By reducing emergency cases, we can help alleviate the burden on the healthcare system.
4. **Data-Driven Insights**: With future data collection, this project could provide valuable insights for medical research and public health initiatives.

## Conclusion

This project represents a proof-of-concept for using wearable data to detect early signs of heart issues. While currently limited by available data, it demonstrates the potential for a more comprehensive system. With further development and data collection, this approach could significantly impact heart health management worldwide, potentially saving countless lives.