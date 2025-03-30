class AudioProcessor extends AudioWorkletProcessor {
    process(inputs) {
        const input = inputs[0];
        if (input.length > 0) {
            this.port.postMessage(input[0]); // Sendet das Float32Array an React
        }
        return true;
    }
}

registerProcessor("audio-processor", AudioProcessor);
