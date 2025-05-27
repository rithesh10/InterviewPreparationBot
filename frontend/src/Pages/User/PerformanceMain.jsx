import React, { useState, useEffect } from 'react';
import config from "../../config/config";
import axios from 'axios';
import Performance from './Performance';

const PerformanceMain = ({ userId }) => {
  const [interviewData, setInterviewData] = useState({ interview_score: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(userId)
    const fetchData = async () => {
      if (!userId) {
        setError('No user ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${config.backendUrl}/gemini/get-calculated-score/${userId}`,
          { withCredentials: true }
        );
        setInterviewData(response.data);
      } catch (err) {
        console.error('Error fetching interview data:', err);
        setError('Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]); 
  if (loading) {
    return <div>Loading performance data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!interviewData?.interview_score?.length) {
    return <div>No performance data available</div>;
  }

  return <Performance interviewData={interviewData} />;
};

export default PerformanceMain;