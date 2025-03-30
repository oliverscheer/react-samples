// import { useEffect, useState } from "react";

// type AudioProcessorCallback = (data: Float32Array) => void;

// export function useAudioProcessor(callback: AudioProcessorCallback) {
//     const [stream, setStream] = useState<MediaStream | null>(null);

//     useEffect(() => {
//         let audioContext: AudioContext | null = null;
//         let source: MediaStreamAudioSourceNode | null = null;
//         let processor: AudioWorkletNode | null = null;

//         const initAudio = async () => {
//             try {
//                 // Zugriff auf das Mikrofon
//                 const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//                 setStream(audioStream);

//                 // AudioContext erstellen
//                 audioContext = new AudioContext();
//                 await audioContext.audioWorklet.addModule('processor.js');
//                 source = audioContext.createMediaStreamSource(audioStream);

//                 // AudioWorkletNode erstellen
//                 processor = new AudioWorkletNode(audioContext, 'my-audio-processor');
//                 processor.port.onmessage = (event) => {
//                     callback(new Float32Array(event.data));
//                 };

//                 source.connect(processor);
//                 processor.connect(audioContext.destination); // Optional: Zum Audio-Ausgang verbinden
//             } catch (error) {
//                 console.error("Error accessing microphone:", error);
//             }
//         };

//         initAudio();

//         return () => {
//             processor?.disconnect();
//             source?.disconnect();
//             audioContext?.close();
//             stream?.getTracks().forEach(track => track.stop());
//         };
//     }, [callback]);

//     return stream;
// }