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
    </div>  
  );
}