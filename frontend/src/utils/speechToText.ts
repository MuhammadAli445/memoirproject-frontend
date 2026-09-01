export async function transcribeAudioBlob(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  const filename = audioBlob.type.includes("wav") ? "recording.wav" : "recording.webm";
  formData.append("file", audioBlob, filename);

  const response = await fetch("http://localhost:8000/speech/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({ detail: "Transcription failed" }));
    throw new Error(errData.detail || "Failed to transcribe audio using backend endpoint.");
  }

  const data = await response.json();
  return data.text || "";
}
