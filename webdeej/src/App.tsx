import { useRef } from "react";
import { Deck } from "./audio/Deck";
import { AudioEngine } from "./audio/AudioEngine";
import WaveformView from "./ui/WaveformView";


export default function App() {
  const engine = AudioEngine.getInstance();

  const deckARef = useRef(new Deck(engine.deckAInput));
  const deckBRef = useRef(new Deck(engine.deckBInput));

  const handleFileChange = (deck: Deck) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await engine.resume();
    await deck.loadFile(file);
  }


  return (
    <div>
      <h2>Deck A</h2>
      <WaveformView deck={deckARef.current} />

      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange(deckARef.current)}
      />
      <button onClick={() => deckARef.current.play()}>Play</button>
      <button onClick={() => deckARef.current.stop()}>Stop</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        defaultValue="1"
        onChange={(e) =>
          deckARef.current.setVolume(parseFloat(e.target.value))
        }
      />
      <button onClick={() => deckARef.current.seek(0)}>Restart</button>

      <div>
        <label>Low</label>
        <input
          type="range"
          min="-30"
          max="10"
          step="0.5"
          defaultValue="0"
          onChange={(e) =>
            deckARef.current.setLow(Number(e.target.value))
          }
        />

        <label>Mid</label>
        <input
          type="range"
          min="-30"
          max="10"
          step="0.5"
          defaultValue="0"
          onChange={(e) =>
            deckARef.current.setMid(Number(e.target.value))
          }
        />

        <label>High</label>
        <input
          type="range"
          min="-30"
          max="10"
          step="0.5"
          defaultValue="0"
          onChange={(e) =>
            deckARef.current.setHigh(Number(e.target.value))
          }
        />
      </div>

      <hr />

      <h2>Deck B</h2>
      <WaveformView deck={deckBRef.current} />
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange(deckBRef.current)}
      />
      <button onClick={() => deckBRef.current.play()}>Play</button>
      <button onClick={() => deckBRef.current.stop()}>Stop</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        defaultValue="1"
        onChange={(e) =>
          deckBRef.current.setVolume(parseFloat(e.target.value))
        }
      />
      <button onClick={() => deckBRef.current.seek(0)}>Restart</button>
      
      <div>
        <label>Low</label>
        <input
          type="range"
          min="-30"
          max="10"
          step="0.5"
          defaultValue="0"
          onChange={(e) =>
            deckARef.current.setLow(Number(e.target.value))
          }
        />

        <label>Mid</label>
        <input
          type="range"
          min="-30"
          max="10"
          step="0.5"
          defaultValue="0"
          onChange={(e) =>
            deckARef.current.setMid(Number(e.target.value))
          }
        />

        <label>High</label>
        <input
          type="range"
          min="-30"
          max="10"
          step="0.5"
          defaultValue="0"
          onChange={(e) =>
            deckARef.current.setHigh(Number(e.target.value))
          }
        />
      </div>
      <hr />

      <h2>Crossfader</h2>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        defaultValue="0"
        onChange={(e) =>
          engine.setCrossfader(parseFloat(e.target.value))
        }
      />
    </div>
  );
}