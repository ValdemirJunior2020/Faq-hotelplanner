import axios from 'axios';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
  process.env.REACT_APP_GEMINI_API_KEY;

export const getAIAnswer = async (question, trainingGuideContext) => {
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Answer the following question using the information from the training guide only.\n\nTraining Guide:\n${trainingGuideContext}\n\nQuestion:\n${question}`
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(GEMINI_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return answer || 'No answer found.';
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Error fetching answer.';
  }
};
