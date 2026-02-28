import React, { useRef, useState } from "react";
import axios from "axios";
import config from "../../config/config";

const VoiceInput = ({ setCurrentAnswer, compact = false }) => {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState("");

  const transcribeAudio = async (audioBlob) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("User is not authenticated. Please login again.");
    }

    const formData = new FormData();
    formData.append("audio", audioBlob, "interview-recording.webm");

    const response = await axios.post(
      `${config.backendUrl}/gemini/transcribe-audio`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response?.data?.text || "";
  };

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        try {
          setIsTranscribing(true);
          const audioBlob = new Blob(chunksRef.current, { type: mimeType });
          const transcript = await transcribeAudio(audioBlob);

          if (transcript) {
            setCurrentAnswer((prev) => {
              if (!prev) return transcript;
              return `${prev.trim()} ${transcript}`.trim();
            });
          }
        } catch (err) {
          setError(err.response?.data?.error || err.message || "Failed to transcribe audio.");
        } finally {
          setIsTranscribing(false);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setError("Microphone access denied or unavailable.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isTranscribing}
        className={`px-4 py-2 rounded-md text-white shadow-md ${
          compact ? "text-sm" : ""
        } ${
          isRecording ? "bg-red-500" : "bg-green-600"
        } disabled:opacity-60`}
      >
        {isRecording ? "Stop Recording" : "Record Answer"}
      </button>

      {isTranscribing && (
        <p className={`${compact ? "text-xs bg-white/85 px-2 py-1 rounded" : "text-sm"} text-blue-600`}>
          Transcribing with Groq Whisper...
        </p>
      )}
      {error && (
        <p className={`${compact ? "text-xs bg-white/85 px-2 py-1 rounded max-w-64" : "text-sm"} text-red-600`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default VoiceInput;
