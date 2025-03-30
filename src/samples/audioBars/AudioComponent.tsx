import React, { useState, useRef, useEffect } from "react";
import AudioBars from "./AudioBars";

const MicrophonePlayer: React.FC = () => {
    // const audioRef = useRef<HTMLAudioElement>(null);
    // const audioContextRef = useRef<AudioContext | null>(null);
    // const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    // const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);

    const [audioBytes, setAudioBytes] = useState<Float32Array>()

    const startMicrophone = async () => {
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(audioStream);
            setIsRecording(true);

            if (audioRef.current) {
                audioRef.current.srcObject = audioStream;
                audioRef.current.play();
            }

            await processAudioStream(audioStream);
        } catch (error) {
            console.error("Mikrofon-Zugriff verweigert:", error);
        }
    };

    const stopMicrophone = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }

        workletNodeRef.current?.disconnect();
        audioContextRef.current?.close();
        setIsRecording(false);
    };

    const processAudioStream = async (audioStream: MediaStream) => {
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }

        const audioContext = new AudioContext();
        await audioContext.audioWorklet.addModule("audio-processor.js"); // Worklet laden

        const source = audioContext.createMediaStreamSource(audioStream);
        const workletNode = new AudioWorkletNode(audioContext, "audio-processor");

        workletNode.port.onmessage = (event) => {
            const float32Array = new Float32Array(event.data);
            setAudioBytes(float32Array);
            console.log("Float32Array Data:", float32Array.slice(0, 10)); // Log der ersten 10 Werte
        };

        source.connect(workletNode);
        workletNode.connect(audioContext.destination); // Optional für Audioausgabe

        audioContextRef.current = audioContext;
        workletNodeRef.current = workletNode;
    };

    return (
        <div className="p-4 border rounded-lg shadow-lg max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold">🎤 Mikrofon Test</h2>
            <div className="mt-4">
                <button
                    onClick={isRecording ? stopMicrophone : startMicrophone}
                    className={`px-4 py-2 rounded-md text-white ${isRecording ? "bg-red-500" : "bg-green-500"}`}>
                    {isRecording ? "Stoppen" : "Starten"}
                </button>
            </div>
            <p className="mt-2">{isRecording ? "🎙 Mikrofon läuft..." : "🔇 Mikrofon aus"}</p>
            <AudioBars data={audioBytes} color="blue" barWidth={10} width={300} barSpacing={2} height={100} />
            <br/>
            <AudioBars data={audioBytes} center={false} color="green" width={300} barSpacing={2} height={100} />
            <br/>
            <audio ref={audioRef} autoPlay controls muted className="mt-4 w-full" />
        </div>
    );
};

export default MicrophonePlayer;







// import React, { useState, useRef, useEffect } from "react";
// import AudioBars from "./AudioBars";

// const MicrophonePlayer: React.FC = () => {
//     const [stream, setStream] = useState<MediaStream | null>(null);
//     const [isRecording, setIsRecording] = useState(false);
//     // const audioRef = useRef<HTMLAudioElement>(null);
//     const audioContextRef = useRef<AudioContext | null>(null);
//     const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
//     const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

//     const [audioBytes, setAudioBytes] = useState<Float32Array>()

//     const startMicrophone = async () => {
//         try {
//             const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             setStream(audioStream);
//             setIsRecording(true);

//             // if (audioRef.current) {
//             //     audioRef.current.srcObject = audioStream;
//             //     audioRef.current.play();
//             // }

//             processAudioStream(audioStream);
//         } catch (error) {
//             console.error("Mikrofon-Zugriff verweigert:", error);
//         }
//     };

//     const stopMicrophone = () => {
//         if (stream) {
//             stream.getTracks().forEach(track => track.stop());
//             setStream(null);
//         }

//         // Audio-Verarbeitung stoppen
//         scriptProcessorRef.current?.disconnect();
//         sourceRef.current?.disconnect();
//         if (audioContextRef.current) {
//             audioContextRef.current.close().catch(error => console.error("Error closing AudioContext:", error));
//         }

//         setIsRecording(false);
//     };

//     const processAudioStream = (audioStream: MediaStream) => {
//         if (audioContextRef.current) {
//             audioContextRef.current.close().catch(error => console.error("Error closing AudioContext:", error));
//         }

//         const audioContext = new AudioContext();
//         const source = audioContext.createMediaStreamSource(audioStream);
//         const scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);

//         scriptProcessor.onaudioprocess = (event) => {
//             const inputBuffer = event.inputBuffer.getChannelData(0); // Erstes Audiokanal
//             const float32Array = new Float32Array(inputBuffer);
//             setAudioBytes(float32Array);
//             console.log("Float32Array Data:", float32Array.slice(0, 10)); // Loggt die ersten 10 Werte
//         };

//         source.connect(scriptProcessor);
//         scriptProcessor.connect(audioContext.destination); // Optional: Damit kein Delay entsteht

//         audioContextRef.current = audioContext;
//         sourceRef.current = source;
//         scriptProcessorRef.current = scriptProcessor;
//     };

//     return (
//         <div className="p-4 border rounded-lg shadow-lg max-w-md mx-auto text-center">
//             <h2 className="text-xl font-semibold">🎤 Mikrofon Test</h2>
//             <div className="mt-4">
//                 <button
//                     onClick={isRecording ? stopMicrophone : startMicrophone}
//                     className={`px-4 py-2 rounded-md text-white ${isRecording ? "bg-red-500" : "bg-green-500"}`}>
//                     {isRecording ? "Stoppen" : "Starten"}
//                 </button>
//             </div>
//             <p className="mt-2">{isRecording ? "🎙 Mikrofon läuft..." : "🔇 Mikrofon aus"}</p>
//             <AudioBars data={audioBytes} color="blue" barWidth={10} width={300} barSpacing={2} height={100} />
//             <br/>
//             <AudioBars data={audioBytes} center={false} color="green" width={300} barSpacing={2} height={100} />
            
//             {/* <audio ref={audioRef} autoPlay controls muted className="mt-4 w-full" /> */}
//         </div>
//     );
// };

// export default MicrophonePlayer;




