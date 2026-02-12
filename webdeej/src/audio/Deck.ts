import { AudioEngine } from "./AudioEngine";

export class Deck {
    private context = AudioEngine.getInstance().context;
    private buffer?: AudioBuffer;
    private source?: AudioBufferSourceNode;
    private gainNode: GainNode;

    constructor() {
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
    }   

    async loadFile(file: File) {
        const arrayBuffer = await file.arrayBuffer();
        this.buffer = await this.context.decodeAudioData(arrayBuffer);
    }

    play() {
        if (!this.buffer) return;
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        
        this.source.connect(this.gainNode);
        this.source.start();
    }
    
    stop(){
        this.source?.stop();
    }

    setVolume(value: number) {
        this.gainNode.gain.value = value;
    }
}