import React, { useState } from 'react';
import api from '../api';

const VotingPage = ({ userId }) => {
  const [eventId, setEventId] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleVote = async () => {
    setResponse(null);
    setError(null);

    try {
      const res = await api.post(`/events/${eventId}/vote`, null, {
        params: { user_id: userId },
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Event Voting</h1>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Event ID:
          <input
            type="text"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
        <button onClick={handleVote} style={buttonStyle}>
          Vote
        </button>
      </div>
      {response && (
        <div>
          <h2>Response:</h2>
          <pre style={preStyle}>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

const buttonStyle = {
  marginLeft: '10px',
  padding: '10px 15px',
  fontSize: '16px',
  cursor: 'pointer',
};

const preStyle = {
  backgroundColor: '#f4f4f4',
  padding: '10px',
  borderRadius: '5px',
  overflowX: 'auto',
};

export default VotingPage;
