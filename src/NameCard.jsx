import { useState, useRef, useEffect } from "react";
import AnimatedAppTitle from "../AnimatedTitle";

const NameCard = () => {
  // Default rotation values for the permanent 3D effect
  const defaultRotation = { x: -5, y: 15 };

  const [rotation, setRotation] = useState(defaultRotation);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasShimmered, setHasShimmered] = useState(false);
  const cardRef = useRef(null);

  // Handle initial mount animation
  useEffect(() => {
    // Small delay before starting the animation
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    // Trigger shimmer effect after mount animation
    const shimmerTimer = setTimeout(() => {
      setHasShimmered(true);
    }, 1200);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(shimmerTimer);
    };
  }, []);

  // Auto animation when not being hovered
  useEffect(() => {
    if (isHovered) return;

    let animationFrame;
    let angle = 0;
    // Start with a very small initial value to prevent the "bump"
    const initialAmplitude = 0.05;
    const targetAmplitude = 2;
    let currentAmplitude = initialAmplitude;

    const animate = () => {
      // Gradually increase the animation amplitude to create a smooth transition
      if (currentAmplitude < targetAmplitude) {
        currentAmplitude = Math.min(targetAmplitude, currentAmplitude + 0.02);
      }

      // Create a subtle floating animation with gradually increasing amplitude
      const x = defaultRotation.x + Math.sin(angle * 0.3) * currentAmplitude;
      const y = defaultRotation.y + Math.cos(angle * 0.2) * currentAmplitude;

      setRotation({ x, y });
      angle += 0.01;

      animationFrame = requestAnimationFrame(animate);
    };

    // Only start the floating animation after the card has mounted
    if (isMounted) {
      // Reset rotation to default first to ensure we start from a consistent position
      setRotation(defaultRotation);
      // Small delay before starting the floating animation
      const floatTimer = setTimeout(() => {
        animate();
      }, 100);

      return () => {
        clearTimeout(floatTimer);
        cancelAnimationFrame(animationFrame);
      };
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isHovered, isMounted]);

  // Track mouse position globally to avoid hover event conflicts
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current || !isMounted) return;

      // Get card position and dimensions
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();

      // Check if mouse is over the card
      const isOver =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      // Update hover state
      setIsHovered(isOver);

      // If mouse is over card, calculate rotation
      if (isOver) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 15;
        const rotateX = ((centerY - y) / centerY) * 15;

        setRotation({ x: rotateX, y: rotateY });
      }
    };

    // Add global mouse move event
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMounted]);

  // Starting rotation for entrance animation
  const initialRotation = { x: -25, y: 45 };

  // Calculate current rotation based on mount state
  // Use a smoother transition by gradually shifting to the rotation state
  const currentRotation = {
    x: isMounted ? rotation.x : initialRotation.x,
    y: isMounted ? rotation.y : initialRotation.y,
  };

  return (
    <div
      className="flex justify-center items-center p-6 "
      style={{ position: "relative", zIndex: 10 }}
    >
      <div
        ref={cardRef}
        className="relative w-96 p-6 bg-gradient-to-br from-indigo-600/80 to-purple-700/80 rounded-lg transition-all duration-500 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${
            currentRotation.x
          }deg) rotateY(${currentRotation.y}deg) scale(${
            isHovered ? 1.08 : isMounted ? 1.02 : 0.7
          })`,
          opacity: isMounted ? 1 : 0,
          boxShadow: isHovered
            ? "0 35px 60px rgba(0,0,0,0.4), 0 15px 40px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.2)"
            : "0 25px 50px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)",
          transformStyle: "preserve-3d",
          pointerEvents: "none", // Prevents the card from catching mouse events
          transition: isMounted
            ? "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000)"
            : "opacity 0.8s ease-out, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          className="flex flex-col items-center gap-3 "
          style={{
            opacity: isMounted ? 1 : 0,
            transition:
              "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out",
            transitionDelay: "0.2s",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="rounded-full border-2 border-purple-800 overflow-hidden w-50 h-50"
            style={{
              transform: `translateZ(${isMounted ? 0 : -20}px)`,
              opacity: isMounted ? 1 : 0,
              transition:
                "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out",
              transitionDelay: "0.3s",
            }}
          >
            <img
              src="/screenshots/profile.jpeg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div
            style={{
              transform: `translateZ(${isMounted ? 0 : -20}px)`,
              opacity: isMounted ? 1 : 0,
              transition:
                "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out",
              transitionDelay: "0.5s",
            }}
          >
            <AnimatedAppTitle />
          </div>
        </div>

        {/* Multiple highlight effects for more depth */}
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background:
              "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.15) 40%, transparent 60%)",
            opacity: isHovered ? 1 : 0.7,
            transition: "opacity 0.5s ease",
            transform: "translateZ(20px)",
          }}
        />

        {/* Edge highlight */}
        <div
          className="absolute inset-0 rounded-lg border border-white"
          style={{
            opacity: isHovered ? 0.2 : 0.1,
            transition: "opacity 0.5s ease",
            transform: "translateZ(10px)",
          }}
        />

        {/* Entrance shimmer effect */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            opacity: hasShimmered ? 0 : isMounted ? 0.8 : 0,
            transition: "opacity 1.5s ease",
            transform: "translateZ(30px)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(45deg, transparent, rgba(255,255,255,0.5), transparent)",
              transform: `translateX(${hasShimmered ? "100%" : "-100%"})`,
              transition: "transform 1s ease",
              transitionDelay: "0.6s",
            }}
          />
        </div>

        {/* Subtle glow effect */}
        <div
          className="absolute -inset-2 rounded-xl"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)",
            opacity: isHovered ? 0.8 : 0.4,
            transition: "opacity 0.5s ease",
            transform: "translateZ(5px)",
            filter: "blur(8px)",
          }}
        />
      </div>
    </div>
  );
};

export default NameCard;
