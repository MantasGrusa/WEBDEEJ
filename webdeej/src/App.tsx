import { useRef } from "react";
import { Deck } from "./audio/Deck";
import { AudioEngine } from "./audio/AudioEngine";



export default function App() {
  const deckRef = useRef<Deck>(new Deck());

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await deckRef.current.loadFile(file);
    deckRef.current.play();
  }


  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={() => deckRef.current.play()}>Play</button>
      <button onClick={() => deckRef.current.stop()}>Stop</button>
      <input type="range" min="0" max="1" step="0.01" onChange={(e) => deckRef.current.setVolume(parseFloat(e.target.value))} />
      <button onClick={()=> deckRef.current.seek(0)}>Restart</button>
    </div>  
  );
}