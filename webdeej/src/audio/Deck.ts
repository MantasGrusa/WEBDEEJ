import { AudioEngine } from "./AudioEngine";

export class Deck {
    private context = AudioEngine.getInstance().context;
    private buffer?: AudioBuffer;
    private source?: AudioBufferSourceNode;
    private gainNode: GainNode;
    private startTime = 0;   // when playback began (context time)
    private offset = 0;     // position inside the track
    private isPlaying = false;
    private output: GainNode;
    private lowFilter: BiquadFilterNode;
    private midFilter: BiquadFilterNode;
    private highFilter: BiquadFilterNode;


    constructor(output: GainNode) {
        this.output = output;

        this.gainNode = this.context.createGain();

        // Create filters
        this.lowFilter = this.context.createBiquadFilter();
        this.midFilter = this.context.createBiquadFilter();
        this.highFilter = this.context.createBiquadFilter();

        // Configure filters
        this.lowFilter.type = "lowshelf";
        this.lowFilter.frequency.value = 320;

        this.midFilter.type = "peaking";
        this.midFilter.frequency.value = 1000;
        this.midFilter.Q.value = 1;

        this.highFilter.type = "highshelf";
        this.highFilter.frequency.value = 3200;

        // Chain them
        this.lowFilter.connect(this.midFilter);
        this.midFilter.connect(this.highFilter);
        this.highFilter.connect(this.gainNode);
        this.gainNode.connect(this.output);
    }
    async loadFile(file: File) {
        const arrayBuffer = await file.arrayBuffer();
        this.buffer = await this.context.decodeAudioData(arrayBuffer);
        this.offset = 0; // reset position on new load
    }
    play() {
        if (!this.buffer || this.isPlaying) return;
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        
        this.source.connect(this.lowFilter);
        
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

    setLow(value: number) {
        this.lowFilter.gain.value = value;
    }

    setMid(value: number) {
        this.midFilter.gain.value = value;
    }

    setHigh(value: number) {
        this.highFilter.gain.value = value;
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
    getBuffer(){
        return this.buffer;
    }


}