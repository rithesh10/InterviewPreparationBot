// import React, { useState, useEffect, useCallback } from 'react';
// import { Mic, MicOff, Loader2 } from 'lucide-react';

// const VoiceInput = ({ onTranscript, isDisabled = false }) => {
//   const [isListening, setIsListening] = useState(false);
//   const [isSupported, setIsSupported] = useState(true);
//   const [isPending, setIsPending] = useState(false);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
//       setIsSupported(false);
//       setErrorMsg('Speech recognition is not supported in your browser.');
//     }
//   }, []);

//   const recognition = useCallback(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) return null;

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';

//     return recognition;
//   }, []);

//   const startListening = useCallback(() => {
//     if (isDisabled) return;

//     setErrorMsg(null);
//     setIsPending(true);

//     const recognitionInstance = recognition();
//     if (!recognitionInstance) return;

//     recognitionInstance.onstart = () => {
//       setIsListening(true);
//       setIsPending(false);
//     };

//     recognitionInstance.onresult = (event) => {
//       const transcript = Array.from(event.results)
//         .map(result => result[0].transcript)
//         .join(' ');

//       onTranscript(transcript);
//     };

//     recognitionInstance.onerror = (event) => {
//       if (event.error === 'not-allowed') {
//         setErrorMsg('Microphone access denied. Please check your permissions.');
//       } else {
//         setErrorMsg(`Error: ${event.error}`);
//       }
//       setIsListening(false);
//       setIsPending(false);
//     };

//     recognitionInstance.onend = () => {
//       setIsListening(false);
//       setIsPending(false);
//     };

//     try {
//       recognitionInstance.start();
//     } catch (error) {
//       setErrorMsg('Error starting voice recognition.');
//       setIsPending(false);
//     }

//     return recognitionInstance;
//   }, [isDisabled, onTranscript, recognition]);

//   const stopListening = useCallback((recognitionInstance) => {
//     if (recognitionInstance) {
//       recognitionInstance.stop();
//     }
//     setIsListening(false);
//   }, []);

//   const toggleListening = () => {
//     if (isListening) {
//       const recognitionInstance = recognition();
//       if (recognitionInstance) stopListening(recognitionInstance);
//     } else {
//       startListening();
//     }
//   };

//   if (!isSupported) {
//     return (
//       <div className="flex flex-col items-center space-y-2">
//         <button
//           className="bg-gray-400 text-white p-3 rounded-full cursor-not-allowed"
//           disabled
//           title={errorMsg || 'Voice input not supported'}
//         >
//           <MicOff size={20} />
//         </button>
//         {errorMsg && <span className="text-red-500 text-sm">{errorMsg}</span>}
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center space-y-2">
//       <button
//         className={`relative p-3 rounded-full border-2 ${isListening ? 'bg-red-500 border-red-700 animate-pulse' : 'bg-blue-500 border-blue-700'}
//         ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}
//         ${isPending ? 'cursor-wait' : 'cursor-pointer'} transition-all`}
//         onClick={toggleListening}
//         disabled={isDisabled || isPending}
//         title={isListening ? 'Stop recording' : 'Start voice input'}
//         aria-label={isListening ? 'Stop recording' : 'Start voice input'}
//       >
//         {isPending ? (
//           <Loader2 size={20} className="animate-spin text-white" />
//         ) : isListening ? (
//           <>
//             <Mic size={20} className="text-white" />
//             <span className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-white animate-ping"></span>
//           </>
//         ) : (
//           <Mic size={20} className="text-white" />
//         )}
//       </button>
//       {errorMsg && <span className="text-red-500 text-sm">{errorMsg}</span>}
//     </div>
//   );
// };

// export default VoiceInput;

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
      recognition.stop(); // Stop any existing recognition cleanly
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
      setCurrentAnswer(transcript); // <-- Correctly set the current answer
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
