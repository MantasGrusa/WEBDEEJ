import {useEffect, useRef} from "react";
import { Deck } from "../audio/Deck";
import { WaveformCanvas } from "../visuals/WaveformCanvas";

interface Props{
    deck: Deck;
}

export default function WaveformView({ deck }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<WaveformCanvas | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new WaveformCanvas(canvas, deck);
    rendererRef.current = renderer;

    renderer.startPlaybackCursor();

    return () => {
      renderer.stopPlaybackCursor();
    };
  }, [deck]);

  // NEW: expose a way to refresh after load
  useEffect(() => {
    const interval = setInterval(() => {
      if (rendererRef.current && deck.getBuffer()) {
        rendererRef.current.refreshWaveform();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [deck]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={150}
      style={{ border: "1px solid gray" }}
    />
  );
}
