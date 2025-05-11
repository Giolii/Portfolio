import { useState, useRef, useEffect } from "react";

const BioCard = () => {
  // Default rotation values for the permanent 3D effect
  const defaultRotation = { x: 3, y: -5 };

  const [rotation, setRotation] = useState(defaultRotation);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [isHighlightAnimating, setIsHighlightAnimating] = useState(false);
  const cardRef = useRef(null);

  // Handle initial mount animation
  useEffect(() => {
    // Sequence of animations
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 300);

    const textTimer = setTimeout(() => {
      setIsTextVisible(true);
    }, 800);

    const highlightTimer = setTimeout(() => {
      setIsHighlightAnimating(true);
    }, 1800);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(textTimer);
      clearTimeout(highlightTimer);
    };
  }, []);

  // Auto animation when not being hovered
  useEffect(() => {
    if (isHovered || !isMounted) return;

    let animationFrame;
    let angle = 0;

    const animate = () => {
      // Create a subtle floating animation
      const x = defaultRotation.x + Math.sin(angle * 0.3) * 1.5;
      const y = defaultRotation.y + Math.cos(angle * 0.2) * 1.5;

      setRotation({ x, y });
      angle += 0.01;

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isHovered, isMounted]);

  // Track mouse position
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

        const rotateY = ((x - centerX) / centerX) * 6;
        const rotateX = ((centerY - y) / centerY) * 6;

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
  const initialRotation = { x: 15, y: -25 };

  // Calculate current rotation based on mount state
  const currentRotation = {
    x: isMounted ? rotation.x : initialRotation.x,
    y: isMounted ? rotation.y : initialRotation.y,
  };

  return (
    <>
      <div className="relative w-full py-12">
        {/* Decorative background elements */}
        <div className="mb-16 text-center relative">
          <h2
            className="conq w-full  text-center  p-4 text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 inline-block"
            style={{
              opacity: isTextVisible ? 1 : 0,
              transform: `translateY(${isTextVisible ? 0 : -20}px)`,
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            Who I am?
          </h2>
          <div
            className="h-1 mt-4 w-24 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-12"
            style={{
              opacity: isTextVisible ? 1 : 0,
              transform: `scaleX(${isTextVisible ? 1 : 0})`,
              transition:
                "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transitionDelay: "0.2s",
            }}
          />
        </div>

        <div
          className="absolute top-1/2 left-0 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl"
          style={{
            opacity: isMounted ? 0.8 : 0,
            transform: `translateY(-50%) scale(${isMounted ? 1 : 0.5})`,
            transition: "opacity 1.5s ease, transform 1.5s ease",
          }}
        />

        <div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"
          style={{
            opacity: isMounted ? 0.7 : 0,
            transform: `scale(${isMounted ? 1 : 0.5})`,
            transition: "opacity 1.5s ease, transform 1.5s ease",
            transitionDelay: "0.2s",
          }}
        />

        {/* Main card */}
        <div
          ref={cardRef}
          className="relative max-w-3xl mx-auto overflow-hidden rounded-xl"
          style={{
            transform: `perspective(1000px) rotateX(${
              currentRotation.x
            }deg) rotateY(${currentRotation.y}deg) scale(${
              isHovered ? 1.02 : isMounted ? 1 : 0.9
            })`,
            opacity: isMounted ? 1 : 0,
            transition:
              "opacity 1s ease, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transformStyle: "preserve-3d",
            boxShadow: isHovered
              ? "0 25px 50px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.3)"
              : "0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          {/* Card background with gradient */}
          <div className="relative p-8 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-indigo-800/90 border border-white/10 backdrop-blur-sm">
            {/* Title with special styling */}
            {/* <h2
            className="text-center text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 happy"
            style={{
              opacity: isTextVisible ? 1 : 0,
              transform: `translateY(${isTextVisible ? 0 : -20}px)`,
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            Who I am?
          </h2> */}

            {/* Bio text with animated appearance */}
            <div
              className="text-2xl tracking-wider leading-relaxed text-indigo-100/90 point"
              style={{
                opacity: isTextVisible ? 1 : 0,
                transform: `translateY(${isTextVisible ? 0 : 20}px)`,
                transition: "opacity 0.8s ease, transform 0.8s ease",
                transitionDelay: "0.2s",
              }}
            >
              <p className="text-center mb-3 border-b">
                Former Italian Army paratrooper turned self-taught software
                engineer.
              </p>
              <p className="text-center mb-3 border-b">
                After moving to the US, I sustained myself waiting tables and
                building WordPress sites.
              </p>
              <p className="text-center mb-3 border-b">
                Now I create full-stack applications with React and Node.js.
              </p>

              <p className="text-center">
                My unconventional path gives me a unique perspective between
                technical skills and human connection, something I bring to
                every project while continuously growing as a developer.
              </p>
            </div>

            {/* Multiple highlights to create depth and visual interest */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
              style={{
                opacity: isHovered ? 0.8 : 0.4,
                transition: "opacity 0.5s ease",
              }}
            />

            {/* Moving highlight for entrance animation */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{
                transform: `translateX(${
                  isHighlightAnimating ? "100%" : "-100%"
                })`,
                opacity: isMounted ? 1 : 0,
                transition: "transform 1.5s ease-in-out, opacity 0.5s ease",
              }}
            />

            {/* Edge highlight */}
            <div
              className="absolute inset-0 rounded-lg border border-white/20"
              style={{
                opacity: isHovered ? 0.6 : 0.2,
                transition: "opacity 0.5s ease",
              }}
            />

            {/* Keyword highlight spans - these will animate in sequence */}
            {[
              { text: "Italian Army", left: "5%", top: "35%", delay: 1.2 },
              {
                text: "software engineer",
                left: "55%",
                top: "35%",
                delay: 1.5,
              },
              { text: "React", left: "30%", top: "60%", delay: 1.8 },
              { text: "Node.js", left: "50%", top: "60%", delay: 2.1 },
              {
                text: "unique perspective",
                left: "20%",
                top: "75%",
                delay: 2.4,
              },
            ].map((keyword, index) => (
              <div
                key={index}
                className="absolute w-16 h-16 rounded-full pointer-events-none"
                style={{
                  left: keyword.left,
                  top: keyword.top,
                  background:
                    "radial-gradient(circle, rgba(167,139,250,0.3) 0%, rgba(167,139,250,0) 70%)",
                  transform: `scale(${isMounted ? 1 : 0})`,
                  opacity: isMounted ? 0.6 : 0,
                  transition:
                    "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease",
                  transitionDelay: `${keyword.delay}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BioCard;
