import { useEffect, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = ({ className, children }) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: "none", // This prevents the particles from capturing clicks
        }}
      >
        {init && (
          <Particles
            id="tsparticles"
            loaded={particlesLoaded}
            options={{
              background: {
                color: {
                  value: "#000000",
                },
                image:
                  "linear-gradient(45deg, #00205a 0%, #330867 40%, #000022 100%)",
                position: "50% 50%",
                repeat: "no-repeat",
                size: "cover",
              },
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: false, // Disabled click events on particles
                  },
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                  resize: true,
                },
                modes: {
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                color: {
                  value: [
                    "#ff9000",
                    "#ff0061",
                    "#00ffff",
                    "#4800ff",
                    "#fffc00",
                  ],
                },
                links: {
                  enable: false,
                },
                collisions: {
                  enable: true,
                },
                move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                    default: "bounce",
                  },
                  random: false,
                  speed: 2,
                  straight: false,
                },
                number: {
                  density: {
                    enable: true,
                    area: 800,
                  },
                  value: 80,
                },
                opacity: {
                  value: 0.5,
                },
                shape: {
                  type: "circle",
                },
                size: {
                  value: { min: 2, max: 6 },
                  animation: {
                    enable: true,
                    speed: 4,
                    minimumValue: 0.1,
                    sync: false,
                  },
                },
              },
              detectRetina: true,
            }}
          />
        )}
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};

export default ParticleBackground;
