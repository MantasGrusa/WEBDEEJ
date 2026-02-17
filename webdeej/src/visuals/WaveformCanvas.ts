import type { LineUtil } from "leaflet";
import { Deck } from "../audio/Deck";

export class WaveformCanvas {
    private canvas: HTMLCanvasElement;
    private deck: Deck;
    private ctx: CanvasRenderingContext2D;
    private animationId?: number;
    
    constructor(canvas: HTMLCanvasElement, deck: Deck){
        this.canvas = canvas;
        this.deck = deck;

        const context = canvas.getContext("2d");
        if (!context) {
            throw new Error("Could not get canvas context");
        }
        this.ctx = context;
    }
    drawStaticWaveform() {
        const buffer = this.deck.getBuffer();
        if (!buffer) return;

        const { width, height } = this.canvas;
        const data = buffer.getChannelData(0);

        const step = Math.ceil(data.length / width);
        const amp = height / 2;

        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = "#888";

        for (let i = 0; i < width; i++) {
            let min = 1.0;
            let max = -1.0;
            
            for (let j = 0; j < step; j++) {
                const datum = data[i * step + j];
                if (datum < min) min = datum;
                if (datum > max) max = datum;
            }
            this.ctx.fillRect(
                i, 
                (1 + min) * amp,
                1,
                Math.max(1, (max - min) * amp)
            );
        }
    }

    startPlaybackCursor() {
        const render = () => {
            this.drawStaticWaveform();
            this.drawCursor();
            this.animationId = requestAnimationFrame(render);
        };
        render();

    }
    stopPlaybackCursor() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
    
        }
    }
    private drawCursor() {
        const buffer = this.deck.getBuffer();
        if (!buffer) return;

        const currentTime = this.deck.getCurrentTime();
        const progress = currentTime / buffer.duration;
        const x = progress * this.canvas.width;

        this.ctx.strokeStyle = "red";
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();
    }
}