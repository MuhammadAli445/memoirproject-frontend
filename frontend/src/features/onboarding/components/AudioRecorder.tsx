"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface AudioRecorderProps {
  onTranscribed: (text: string) => void;
  disabled?: boolean;
}

export function AudioRecorder({ onTranscribed, disabled }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());

        await handleTranscribe(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setError("Microphone access failed or was denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribe = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setError(null);
    try {
      const formData = new FormData();
      const filename = audioBlob.type.includes("wav") ? "recording.wav" : "recording.webm";
      formData.append("file", audioBlob, filename);

      const response = await fetch("http://localhost:8000/speech/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ detail: "Transcription failed" }));
        throw new Error(errData.detail || "Failed to transcribe audio");
      }

      const data = await response.json();
      if (data.text) {
        onTranscribed(data.text);
      } else {
        setError("No speech could be recognized.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during transcription.");
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={disabled || isTranscribing}
            className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/10 px-4 py-2 text-xs font-medium text-terracotta hover:bg-terracotta/20 disabled:opacity-50 transition-colors"
          >
            <Mic className="h-4 w-4" />
            Record Audio
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors animate-pulse"
          >
            <Square className="h-4 w-4 fill-white" />
            Stop Recording
          </button>
        )}

        {isTranscribing && (
          <span className="inline-flex items-center gap-2 text-xs font-medium text-charcoal/70">
            <Loader2 className="h-4 w-4 animate-spin text-terracotta" />
            Converting audio to text with AssemblyAI...
          </span>
        )}
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
