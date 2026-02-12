export class AudioEngine {
    private static instance: AudioEngine;
    private audioContext: AudioContext;

    private constructor() {
        this.audioContext = new AudioContext();
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