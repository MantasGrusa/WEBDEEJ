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

    async resume(){
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
}