/* eslint-disable @typescript-eslint/no-unused-vars */
class MyAudioProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (input.length > 0) {
            const inputChannel = input[0];
            this.port.postMessage(inputChannel);
        }
        return true;
    }
}
