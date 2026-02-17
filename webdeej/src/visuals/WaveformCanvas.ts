import { Deck } from "../audio/Deck";

export class WaveformCanvas {
  private canvas: HTMLCanvasElement;
  private deck: Deck;
  private ctx: CanvasRenderingContext2D;
  private animationId?: number;

  private waveformImage?: HTMLCanvasElement;

  refreshWaveform() {
    this.renderWaveform();
}   

  constructor(canvas: HTMLCanvasElement, deck: Deck) {
    this.canvas = canvas;
    this.deck = deck;

    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas not supported");
    }

    this.ctx = context;
  }

  renderWaveform() {
    const buffer = this.deck.getBuffer();
    if (!buffer) return;

    const width = this.canvas.width;
    const height = this.canvas.height;

    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;

    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    const data = buffer.getChannelData(0);
    const step = Math.floor(data.length / width);
    const amp = height / 2;

    offCtx.fillStyle = "#888";

    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;

      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      offCtx.fillRect(
        i,
        (1 + min) * amp,
        1,
        Math.max(1, (max - min) * amp)
      );
    }
    

    this.waveformImage = offscreen;
  }

  startPlaybackCursor() {
    const render = () => {
      this.drawFrame();
      this.animationId = requestAnimationFrame(render);
    };

    render();
  }

  stopPlaybackCursor() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private drawFrame() {
    if (!this.waveformImage) return;

    // draw cached waveform
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.waveformImage, 0, 0);

    this.drawCursor();
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
