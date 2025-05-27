import React, { useState, useEffect } from "react";
import config from "../../config/config";
import axios from "axios";
import VoiceInput from "./VoiceInput";

const Test = ({ resumeText, jobDescription, onBack, userId }) => {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [interviewId, setInterviewId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    startInterviewSession();
  }, []);

  const startInterviewSession = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${config.backendUrl}/gemini/start_interview_session`,
        {
          resume_summary: resumeText,
          jd_summary: jobDescription,
        },
        {
          withCredentials: true,
        }
      );

      setQuestion(response.data.question);
      setInterviewId(response.data.interview_id);
      setIsLoading(false);
    } catch (error) {
      console.error("Error starting interview:", error);
      setError("Failed to start the interview. Please try again.");
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (e) => {
    setCurrentAnswer(e.target.value);
  };

  const handleVoiceInput = (text) => {
    setCurrentAnswer((prev) => (prev ? prev + " " + text : text));
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      setError("Please provide an answer before submitting.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${config.backendUrl}/gemini/answer_interview_question`,
        {
          interview_id: interviewId,
          answer: currentAnswer,
        },
        {
          withCredentials: true,
        }
      );

      if (
        response.data.status === "concluded" ||
        response.data.interview_score === true
      ) {
        setIsCompleted(true);
        fetchInterviewScore();
      } else {
        setQuestion(response.data.question);
        setCurrentAnswer("");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setError("Failed to submit your answer. Please try again.");
      setIsLoading(false);
    }
  };

  const fetchInterviewScore = async () => {
    try {
      const response = await axios.get(
        `${config.backendUrl}/gemini/calculate-scores/${interviewId}`,
        {
          withCredentials: true,
        }
      );
      setAssessmentResult(response.data);
    } catch (error) {
      console.error("Error fetching interview score:", error);
      setError("Failed to calculate interview score.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Interview Simulation
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button
            className="text-red-700 underline ml-2"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {!isCompleted ? (
        <>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Question:</h2>
            <p className="text-gray-800">{question}</p>
          </div>

          <div className="mb-6">
             <h2 className="text-lg font-semibold mb-2">Your Answer:</h2>
            {" "}
            <textarea
              value={currentAnswer}
              readOnly
              rows="6"
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 bg-gray-100"
            />
             <VoiceInput setCurrentAnswer={setCurrentAnswer} />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmitAnswer}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md disabled:bg-blue-300"
            >
              {isLoading ? "Submitting..." : "Next"}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6">Interview Completed</h2>

          {assessmentResult ? (
            <div className="text-left">
              <div className="mb-4">
                <h3 className="text-xl font-semibold">Score: {assessmentResult.score}/100</h3>
                <p className="mt-2">{assessmentResult.summary}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-green-600">Strengths:</h3>
                <ul className="list-disc pl-5 mt-1">
                  {assessmentResult.strengths.map((strength, index) => (
                    <li key={index} className="mt-1">{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-red-600">Areas for Improvement:</h3>
                <ul className="list-disc pl-5 mt-1">
                  {assessmentResult.weaknesses.map((weakness, index) => (
                    <li key={index} className="mt-1">{weakness}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-600">Suggestions:</h3>
                <ul className="list-disc pl-5 mt-1">
                  {assessmentResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="mt-1">{suggestion}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold">Communication Skills</h3>
                  <p className="text-sm mt-1">{assessmentResult.communication_skills}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold">Technical Knowledge</h3>
                  <p className="text-sm mt-1">{assessmentResult.technical_knowledge}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold">Soft Skills</h3>
                  <p className="text-sm mt-1">{assessmentResult.soft_skills}</p>
                </div>
              </div>

              {assessmentResult.red_flags && assessmentResult.red_flags.length > 0 && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-700">Red Flags:</h3>
                  <ul className="list-disc pl-5 mt-1">
                    {assessmentResult.red_flags.map((flag, index) => (
                      <li key={index} className="mt-1 text-red-700">{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p>Calculating your interview score...</p>
          )}

          <button
            onClick={onBack}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Test;
