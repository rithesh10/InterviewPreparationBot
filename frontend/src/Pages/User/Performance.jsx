import React, { useEffect, useState } from 'react';
import config from "../../config/config";
import axios from 'axios';

const Performance = ({ userId }) => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        console.log(userId);
        // Change POST to GET
        const response = await axios.get(`${config.backendUrl}/gemini/get-calculated-score/${userId}`, 
          { withCredentials: true });
        console.log("Response data:", response.data);
        setPerformanceData(response.data.interview_score);
      } catch (err) {
        console.error('Error fetching performance:', err);
        setError('Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPerformance();
    }
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!performanceData) return <div>No performance data available.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Performance Summary</h2>
      <p><strong>Score:</strong> {performanceData.score}</p>
      <p><strong>Summary:</strong> {performanceData.summary}</p>

      <h3>Strengths</h3>
      <ul>
        {performanceData.strengths?.map((strength, index) => (
          <li key={index}>{strength}</li>
        ))}
      </ul>

      <h3>Weaknesses</h3>
      <ul>
        {performanceData.weaknesses?.map((weakness, index) => (
          <li key={index}>{weakness}</li>
        ))}
      </ul>

      <h3>Suggestions</h3>
      <ul>
        {performanceData.suggestions?.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>

      <p><strong>Communication Skills:</strong> {performanceData.communication_skills}</p>
      <p><strong>Technical Knowledge:</strong> {performanceData.technical_knowledge}</p>
      <p><strong>Soft Skills:</strong> {performanceData.soft_skills}</p>

      <h3>Red Flags</h3>
      <ul>
        {performanceData.red_flags?.map((redFlag, index) => (
          <li key={index}>{redFlag}</li>
        ))}
      </ul>
    </div>
  );
};

export default Performance;