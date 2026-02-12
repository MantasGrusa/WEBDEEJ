export class AudioEngine {
    private static instance: AudioEngine;
    private audioContext: AudioContext;
    private MasterGain: GainNode;
    
    private constructor() {
        this.audioContext = new AudioContext();
        
        //MasterGain is used to control the overall volume of the audio output
        this.MasterGain = this.audioContext.createGain();
        this.MasterGain.connect(this.audioContext.destination);
    }
    
    get masterGain(): GainNode {
        return this.MasterGain;
    }
    static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine();
        }   
        return AudioEngine.instance;
    }

    get context(): AudioContext {
        return this.audioContext;
    }

    async resume(){
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
}