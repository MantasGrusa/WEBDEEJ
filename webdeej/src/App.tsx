import { AudioEngine } from "./audio/AudioEngine";



export default function App() {
  const startAudio = async () => {
    const audioEngine = AudioEngine.getInstance();
    await audioEngine.resume();
    console.log("Audio ready: ", audioEngine.context.state);
  };

  return <button onClick={startAudio}>Start Audio</button>;
}