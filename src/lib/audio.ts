// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export class Player {

    private playbackNode: AudioWorkletNode | null = null;
    //public stream: MediaStream | null = null;
  
    async init(sampleRate: number) {
      if (this.playbackNode === null) {
        const audioContext = new AudioContext({ sampleRate });
        await audioContext.audioWorklet.addModule("playback-worklet.js");
  
        this.playbackNode = new AudioWorkletNode(audioContext, "playback-worklet");
        this.playbackNode.connect(audioContext.destination);
      }
    }
  
    play(buffer: Int16Array) {
      if (this.playbackNode) {
        this.playbackNode.port.postMessage(buffer);
      }
    }
  
    clear() {
      if (this.playbackNode) {
        this.playbackNode.port.postMessage(null);
      }
    }
  }
  
  
  export class Player2 {
  
    private playbackNode: AudioWorkletNode | null = null;
    public stream: MediaStream | null = null;
    public context: AudioContext | null = null;
  
    public onAudioBytesReceived = new EventEmitter<Float32Array>();
  
    async init(sampleRate: number) {
      if (this.playbackNode === null) {
        const audioContext = new AudioContext({ sampleRate });
        await audioContext.audioWorklet.addModule("playback-worklet.js");
  
        this.context = audioContext;
  
        this.playbackNode = new AudioWorkletNode(audioContext, "playback-worklet");
  
        this.playbackNode.connect(audioContext.destination);
  
        //var source = audioContext.createBufferSource();
  
        const destination = audioContext.createMediaStreamDestination();
        //this.playbackNode.connect(destination)
        //this.playbackNode.connect(audioContext.destination);
  
        const audioStream = destination.stream;
        this.stream = audioStream;
  
        const setupAudioWorklet = async () => {
          await audioContext.audioWorklet.addModule("/audio-processor.js"); // Lade Worklet
          const workletNode = new AudioWorkletNode(audioContext, "audio-processor");
  
          workletNode.port.onmessage = (event) => {
            const float32Array = new Float32Array(event.data);
            //console.log("audio.Float32Array Data:", float32Array);
  
            this.onAudioBytesReceived.emit(float32Array);
          };
  
          //source.connect(workletNode);
          this.playbackNode?.connect(workletNode);
  
          workletNode.connect(audioContext.destination);
        };
  
        setupAudioWorklet();
      }
    }
  
    play(buffer: Int16Array) {
      if (this.playbackNode) {
        this.playbackNode.port.postMessage(buffer);
      }
    }
  
    clear() {
      if (this.playbackNode) {
        this.playbackNode.port.postMessage(null);
      }
    }
  
  }
  
  export class Recorder {
    onDataAvailable: (buffer: ArrayBuffer) => void;
    private audioContext: AudioContext | null = null;
    private mediaStream: MediaStream | null = null;
    private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
    private workletNode: AudioWorkletNode | null = null;
  
    public constructor(onDataAvailable: (buffer: ArrayBuffer) => void) {
      this.onDataAvailable = onDataAvailable;
    }
  
    async start(stream: MediaStream) {
      try {
        this.audioContext = new AudioContext({ latencyHint: "interactive", sampleRate: 24000, });
        await this.audioContext.audioWorklet.addModule(
          "./record-worklet.js",
        );
        this.mediaStream = stream;
        this.mediaStreamSource = this.audioContext.createMediaStreamSource(
          this.mediaStream,
        );
        this.workletNode = new AudioWorkletNode(
          this.audioContext,
          "recorder-worklet",
          {
            numberOfInputs: 1,
            numberOfOutputs: 1,
            channelCount: 1,
            processorOptions: {
              sampleRate: this.audioContext.sampleRate,
            },
          }
        );
        this.workletNode.port.onmessage = (event) => {
          this.onDataAvailable(event.data.buffer);
        };
        this.mediaStreamSource.connect(this.workletNode);
        this.workletNode.connect(this.audioContext.destination);
      } catch (error) {
        this.stop();
      }
    }
  
    stop() {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((track) => track.stop());
      }
      if (this.audioContext) {
        this.audioContext.close();
      }
    }
  }
  
  
  
  
  type EventHandler<T = any> = (data: T) => void;
  
  class EventEmitter<T = any> {
    private listeners: EventHandler<T>[] = [];
  
    on(listener: EventHandler<T>): void {
      this.listeners.push(listener);
    }
  
    off(listener: EventHandler<T>): void {
      this.listeners = this.listeners.filter(l => l !== listener);
    }
  
    emit(data: T): void {
      this.listeners.forEach(listener => listener(data));
    }
  }
  