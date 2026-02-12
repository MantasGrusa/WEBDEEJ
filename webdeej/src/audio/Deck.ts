import { AudioEngine } from "./AudioEngine";

export class Deck {
    private context = AudioEngine.getInstance().context;
    private buffer?: AudioBuffer;
    private source?: AudioBufferSourceNode;
    private gainNode: GainNode;
    private startTime = 0;   // when playback began (context time)
    private offset = 0;     // position inside the track
    private isPlaying = false;

    constructor() {
        this.gainNode = this.context.createGain();
        this.gainNode.connect(AudioEngine.getInstance().master);
    }   

    async loadFile(file: File) {
        const arrayBuffer = await file.arrayBuffer();
        this.buffer = await this.context.decodeAudioData(arrayBuffer);
    }

    play() {
        if (!this.buffer || this.isPlaying) return;
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        
        this.source.connect(this.gainNode);
        
        this.startTime = this.context.currentTime;
        this.source.start(this.context.currentTime + 0.03, this.offset);

        this.isPlaying = true;
    }
    
    stop(){
        if (!this.isPlaying) return;

        this.source?.stop();

        const elapsed = this.context.currentTime - this.startTime;
        this.offset += elapsed;

        this.isPlaying = false;
    }

    setVolume(value: number) {
        this.gainNode.gain.value = value;
    }

    seek(time: number) {
        if (!this.buffer) return;

        const wasPlaying = this.isPlaying;

        if (wasPlaying) {
            this.stop();
        }
        this.offset = Math.min(Math.max(0, time), this.buffer.duration);

        if (wasPlaying) {
            this.play();
        }
    }
    getCurrentTime() {
        if (!this.isPlaying) return this.offset;
        const elapsed = this.context.currentTime - this.startTime;
        return Math.min(this.offset + elapsed, this.buffer?.duration || 0);
    }
}