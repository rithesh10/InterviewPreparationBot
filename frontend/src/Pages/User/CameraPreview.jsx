import React, { useCallback, useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import ReactMarkdown from "react-markdown";

const CameraPreview = ({ overlayText = "", overlayControls = null }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  const stopCamera = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraEnabled(false);
    setIsStarting(false);
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setError("Camera is not supported in this browser.");
        return;
      }

      setIsStarting(true);
      setError("");
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraEnabled(true);
      setIsStarting(false);
    } catch {
      setError("Unable to access camera. Allow permission and use HTTPS/localhost.");
      setCameraEnabled(false);
      setIsStarting(false);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCamera();
      }
    };

    window.addEventListener("pagehide", stopCamera);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", stopCamera);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Live Interview View</h3>
        <button
          type="button"
          onClick={cameraEnabled ? stopCamera : startCamera}
          disabled={isStarting}
          className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 ${
            cameraEnabled ? "bg-red-500 text-white" : "bg-blue-500 text-white"
          } disabled:opacity-60`}
        >
          {cameraEnabled ? <CameraOff size={14} /> : <Camera size={14} />}
          {isStarting ? "Starting..." : cameraEnabled ? "Turn Off" : "Turn On"}
        </button>
      </div>

      <div className="relative w-full h-[72vh] min-h-[460px] max-h-[900px] bg-black rounded-lg overflow-hidden">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />

        {overlayControls && (
          <div className="absolute top-3 right-3 z-20">
            {overlayControls}
          </div>
        )}

        {cameraEnabled && (
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent">
            <p className="text-xs font-semibold text-blue-200 mb-1">Current Question</p>
            <div className="text-sm md:text-base leading-relaxed text-white max-h-44 overflow-y-auto pr-2">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-1">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  li: ({ children }) => <li className="ml-4 list-disc">{children}</li>,
                }}
              >
                {overlayText || "Question will appear here."}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {!cameraEnabled && !isStarting && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
            Camera is off
          </div>
        )}
        {isStarting && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
            Requesting camera permission...
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default CameraPreview;
