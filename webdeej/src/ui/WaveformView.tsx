import {useEffect, useRef} from "react";
import { Deck } from "../audio/Deck";
import { WaveformCanvas } from "../visuals/WaveformCanvas";

interface props{
    deck: Deck;
}

export default function WaveformView({deck}: props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<WaveformCanvas | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const renderer = new WaveformCanvas(canvas, deck);

        rendererRef.current = renderer;
        rendererRef.current.drawStaticWaveform();
        rendererRef.current.startPlaybackCursor();

        return () => {
            rendererRef.current?.stopPlaybackCursor();
        };
    }, [deck]);
    return(
        <canvas 
            ref={canvasRef} 
            width={600} 
            height={150}
            style= {{border: "1px solid grey"}} 
        />
    )
}