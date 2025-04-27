import React, { useState } from "react";

const questionsSet = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    id: 3,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["William Shakespeare", "Mark Twain", "Leo Tolstoy", "Charles Dickens"],
    correctAnswer: "William Shakespeare",
  },
  {
    id: 4,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Silver", "Iron"],
    correctAnswer: "Oxygen",
  },
  {
    id: 5,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
    correctAnswer: "Pacific Ocean",
  },
];

const Test = () => {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = () => {
    let tempScore = 0;
    questionsSet.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        tempScore += 1;
      }
    });
    setScore(tempScore);
    setShowResult(true);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Quick Test</h1>

      {!showResult ? (
        <>
          <div className="space-y-8">
            {questionsSet.map((q) => (
              <div key={q.id} className="space-y-2">
                <div className="font-semibold">{q.question}</div>
                <div className="grid grid-cols-2 gap-4">
                  {q.options.map((option, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleOptionChange(q.id, option)}
                        className="accent-blue-500"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md"
          >
            Submit Test
          </button>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Your Score: {score} / {questionsSet.length}</h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md"
          >
            Retake Test
          </button>
        </div>
      )}
    </div>
  );
};

export default Test;