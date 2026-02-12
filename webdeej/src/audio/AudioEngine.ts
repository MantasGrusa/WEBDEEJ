export class AudioEngine {
    private static instance: AudioEngine;
    private audioContext: AudioContext;
    
    private constructor() {
        this.audioContext = new AudioContext();
    }
  
}