import React, { useState } from "react";

const VoiceInput = ({ setCurrentAnswer }) => {
  const [recognition, setRecognition] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported");
      return;
    }

    if (recognition) {
      recognition.stop(); 
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const newRecognition = new SpeechRecognition();
    newRecognition.continuous = true;
    newRecognition.interimResults = false;
    newRecognition.lang = "en-US";

    newRecognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      console.log("Voice input:", transcript);
      setCurrentAnswer(transcript);
    };

    newRecognition.onend = () => {
      setIsRecording(false);
    };

    newRecognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    newRecognition.start();
    setRecognition(newRecognition);
    setIsRecording(true);
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={isRecording ? stopListening : startListening}
        className={`px-4 py-2 rounded-md ${
          isRecording ? "bg-red-500" : "bg-green-500"
        } text-white`}
      >
        {isRecording ? "Stop" : "Start"} Listening
      </button>
    </div>
  );
};

export default VoiceInput;
