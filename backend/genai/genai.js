const { GoogleGenerativeAI } = require("@google/generative-ai");
const { config } = require('dotenv');
config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
console.log("API Key:", apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", 
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

async function generateFeedback(componentScores, overallRiskScore) {
  console.log("Generating feedback");
  console.log("Component Scores:", componentScores);
  console.log("Overall Risk Score:", overallRiskScore);

  const prompt = `
You are a health advisor AI. Based on the following health scores, provide detailed feedback and recommendations. The scores range from 0 to 10, where 0 is the worst and 10 is the best. Please provide feedback for each component as well as overall health advice. Format your response as a JSON object.

Component Scores:
- Heart Score: ${componentScores.heartScore}
- Sleep Score: ${componentScores.sleepScore}
- Oxygen Score: ${componentScores.oxygenScore}
- HRV Score: ${componentScores.hrvScore}
- Stress Score: ${componentScores.stressScore}

Overall Risk Score: ${overallRiskScore}

Please include the following in your JSON response:
1. A brief summary of overall health status
2. Specific feedback for each component score
3. Three actionable recommendations for improving overall health
4. A motivational message

Format your response as a valid JSON object with the following structure:
{
  "overallSummary": "string",
  "componentFeedback": {
    "heart": "string",
    "sleep": "string",
    "oxygen": "string",
    "hrv": "string",
    "stress": "string"
  },
  "recommendations": ["string", "string", "string"],
  "motivationalMessage": "string"
}
`;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const result = await chatSession.sendMessage("Generate health feedback");
    console.log("AI Response:", result.response.text());

    let responseContent;
    try {
      const cleanedResponse = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
      responseContent = JSON.parse(cleanedResponse);
      console.log("Parsed Response:", responseContent);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("Raw AI response:", result.response.text());
      throw new Error("AI response is not in the expected JSON format");
    }

    return responseContent;
  } catch (error) {
    console.error("Error generating AI feedback:", error);
    // Return a default feedback object in case of an error
    return {
      overallSummary: "Unable to generate personalized feedback at this time.",
      componentFeedback: {
        heart: "Please consult with a healthcare professional for personalized advice.",
        sleep: "Please consult with a healthcare professional for personalized advice.",
        oxygen: "Please consult with a healthcare professional for personalized advice.",
        hrv: "Please consult with a healthcare professional for personalized advice.",
        stress: "Please consult with a healthcare professional for personalized advice."
      },
      recommendations: [
        "Maintain a balanced diet",
        "Exercise regularly",
        "Get adequate sleep"
      ],
      motivationalMessage: "Your health is important. Keep working towards your goals!"
    };
  }
}
module.exports = {
  generateFeedback,
};