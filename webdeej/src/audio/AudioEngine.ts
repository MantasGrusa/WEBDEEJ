export class AudioEngine {
    private static instance: AudioEngine;
    private audioContext: AudioContext;

    private MasterGain: GainNode;
    private deckABus: GainNode;
    private deckBBus: GainNode;

    
    private constructor() {
        this.audioContext = new AudioContext();
        
        //MasterGain is used to control the overall volume of the audio output
        this.MasterGain = this.audioContext.createGain();
        this.MasterGain.connect(this.audioContext.destination);

        this.deckABus = this.audioContext.createGain();
        this.deckBBus = this.audioContext.createGain();

        this.deckABus.connect(this.MasterGain);
        this.deckBBus.connect(this.MasterGain); 
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
    get master(): GainNode {
        return this.MasterGain;
    }
    get deckAInput(): GainNode {
        return this.deckABus;
    }
    get deckBInput(): GainNode {
        return this.deckBBus;
    }

    setCrossfader(value: number) {
        // Clamp value between 0 and 1
        const x = Math.min(Math.max(value, 0), 1);

        const gainA = Math.cos(x * 0.5 * Math.PI);
        const gainB = Math.cos((1 - x) * 0.5 * Math.PI);

        this.deckABus.gain.value = gainA;
        this.deckBBus.gain.value = gainB;
}

    async resume(){
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
}