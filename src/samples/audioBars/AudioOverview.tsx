import { useEffect, useState } from "react";
import AudioBars from "./AudioBars";

const AudioOverview = () => {
  const [audioData, setAudioData] = useState<Float32Array | null>(null);


  useEffect(() => {
    const getMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);

        const updateAudioData = () => {
          // console.log(dataArray);
          analyser.getFloatFrequencyData(dataArray);
          setAudioData(new Float32Array(dataArray));
          requestAnimationFrame(updateAudioData);
        };

        updateAudioData();
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    getMicrophoneAccess();
  }, []);

  return (
    <>
      <AudioBars
        color="red"
        barSpacing={4}
        barWidth={20}
        data={audioData}
        demoMode={false}
        width={1200}
        height={300}
      />
      <AudioBars
        color="blue"
        barSpacing={5}
        barWidth={10}
        data={audioData}
        width={800}
        height={300}
        center={false}
      />
      <AudioBars
        color="orange"
        barSpacing={15}
        barWidth={20}
        data={audioData}
        width={400}
        height={400}
      />
      <AudioBars color="green" data={audioData} height={100} barSpacing={2} barWidth={4}/>
      <AudioBars color="yellow" data={audioData} height={100} />
      <AudioBars color="blue" data={audioData} height={100} center={true}/>
    </>
  );
};

export default AudioOverview;
