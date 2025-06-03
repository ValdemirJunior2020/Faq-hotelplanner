import React, { useState } from 'react';
import { getAIAnswer } from '../api/geminiApi';
import axios from 'axios';

const trainingGuide = `
1. Greet callers with: "Thank you for calling Hotel Reservations. My name is [Agent Name], how may I assist you?"
2. For refunds, never promise. Say: "I will check the policy and if approved, refunds are processed in 2–10 business days."
3. Always ask for itinerary number, guest name, hotel name, and check-in/out dates for verification.
4. For group requests, start with: "What city and state is your group traveling to?"
`;

const FAQForm = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [logStatus, setLogStatus] = useState('');

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setLogStatus('');
    const aiAnswer = await getAIAnswer(question, trainingGuide);
    setAnswer(aiAnswer);

    try {
      await axios.post('http://localhost:5001/log', {
        question,
        answer: aiAnswer,
      });
      setLogStatus('✅ Saved to Google Sheet!');
    } catch (err) {
      console.error('Error logging:', err);
      setLogStatus('❌ Failed to log to sheet.');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Ask a Question</h2>
      <textarea
        rows="4"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question here..."
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
      />
      <br />
      <button onClick={handleAsk} disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? 'Getting Answer...' : 'Ask AI'}
      </button>

      {answer && (
        <div style={{ marginTop: '2rem', background: '#f9f9f9', padding: '1rem', borderRadius: '6px' }}>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}

      {logStatus && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{logStatus}</p>}
    </div>
  );
};

export default FAQForm;
