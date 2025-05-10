import ParticleBackground from "./ParticleBackground";
import MainPage from "./MainPage";

function App() {
  return (
    <div className="App">
      <ParticleBackground className="background-container">
        <div className="relative">
          <MainPage />
        </div>
      </ParticleBackground>
    </div>
  );
}

export default App;
