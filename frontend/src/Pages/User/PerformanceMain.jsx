import React, { useState, useEffect } from 'react';
import config from "../../config/config";
import axios from 'axios';
import Performance from './Performance';

const PerformanceMain = ({ userId }) => {
  const [interviewData, setInterviewData] = useState({ interview_score: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(userId)
  useEffect(() => {
    console.log(userId)
    const fetchData = async () => {
      if (!userId) {
        setError('No user ID provided');
        setLoading(false);
        return;
      }

      try {
        const accessToken=localStorage.getItem("accessToken")
        if(!accessToken)
        {
          console.error('Unauthorized')
        }
        const response = await axios.get(
          `${config.backendUrl}/gemini/get-calculated-score/${userId}`,
          {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }}
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
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
          <p className="text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
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