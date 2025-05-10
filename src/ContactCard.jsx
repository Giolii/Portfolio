import { Github, Linkedin, Mail } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "0px",
        ...options,
      }
    );

    const currentElement = elementRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options.threshold, options.rootMargin]);

  return [elementRef, isInView];
};

const SimpleContactCard = () => {
  // Default rotation values for 3D effect
  const defaultRotation = { x: 5, y: -5 };

  const [rotation, setRotation] = useState(defaultRotation);
  const [isHovered, setIsHovered] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const cardRef = useRef(null);

  // Contact data
  const contactLinks = [
    {
      name: "GitHub",
      icon: <Github />,
      url: "https://github.com/Giolii",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin />,
      url: "https://www.linkedin.com/in/luigi-olianas123/",
    },
    {
      name: "Email",
      icon: <Mail />,
      url: "mailto:luigiolianas1@gmail.com",
    },
  ];

  // Use intersection observer to detect when card is in view
  const [sectionRef, isInView] = useIntersectionObserver({
    threshold: 0.4,
    rootMargin: "-50px 0px",
  });

  // Auto animation when not being hovered
  useEffect(() => {
    if (isHovered || !isInView) return;

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
  }, [isHovered, isInView]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current || !isInView) return;

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

        const rotateY = ((x - centerX) / centerX) * 8;
        const rotateX = ((centerY - y) / centerY) * 8;

        setRotation({ x: rotateX, y: rotateY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isInView]);

  // Starting rotation for entrance animation
  const initialRotation = { x: 15, y: -15 };

  // Calculate current rotation based on view state
  const currentRotation = {
    x: isInView ? rotation.x : initialRotation.x,
    y: isInView ? rotation.y : initialRotation.y,
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full py-10"
      style={{
        opacity: isInView ? 1 : 0,
        transition: "opacity 0.8s ease-out",
      }}
    >
      {/* Main card */}
      <div
        ref={cardRef}
        className="relative max-w-md mx-auto overflow-hidden rounded-xl"
        style={{
          transform: `perspective(1000px) rotateX(${
            currentRotation.x
          }deg) rotateY(${currentRotation.y}deg) scale(${
            isHovered ? 1.02 : isInView ? 1 : 0.9
          })`,
          opacity: isInView ? 1 : 0,
          transition:
            "opacity 1s ease, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? "0 25px 50px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.3)"
            : "0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <div className="relative p-6 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-indigo-800/90 border border-white/10 backdrop-blur-sm">
          {/* Title with special styling */}
          <h2
            className="conq p-2 text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 text-center"
            style={{
              opacity: isInView ? 1 : 0,
              transform: `translateY(${isInView ? 0 : -20}px)`,
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            Contact Me
          </h2>

          {/* Contact links */}
          <div className="flex justify-center gap-6">
            {contactLinks.map((link, index) => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                key={link.name}
                href={link.url}
                onMouseEnter={() => setActiveLink(link.name)}
                onMouseLeave={() => setActiveLink(null)}
                className="relative"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: `scale(${isInView ? 1 : 0.8}) translateY(${
                    isInView ? 0 : 20
                  }px)`,
                  transition:
                    "opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transitionDelay: `${0.3 + index * 0.15}s`,
                }}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeLink === link.name
                      ? "bg-indigo-600"
                      : "bg-indigo-800/70"
                  } border border-indigo-500/30 group`}
                  style={{
                    transform: `translateZ(${
                      activeLink === link.name ? 40 : 20
                    }px) scale(${activeLink === link.name ? 1.1 : 1})`,
                    boxShadow:
                      activeLink === link.name
                        ? "0 10px 30px rgba(79, 70, 229, 0.4)"
                        : "0 5px 15px rgba(0, 0, 0, 0.2)",
                    transition:
                      "transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  <div
                    className={`text-white ${
                      activeLink === link.name ? "scale-110" : ""
                    } transition-transform duration-300`}
                  >
                    {link.icon}
                  </div>

                  {/* Hover tooltip */}
                  <div
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-sm py-1 px-3 rounded pointer-events-none whitespace-nowrap"
                    style={{
                      opacity: activeLink === link.name ? 1 : 0,
                      transform: `translateY(${
                        activeLink === link.name ? 0 : -10
                      }px) translateZ(50px)`,
                      transition: "opacity 0.2s ease, transform 0.2s ease",
                    }}
                  >
                    {link.name}
                  </div>

                  {/* Pulse effect */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(79, 70, 229, 0.4) 0%, transparent 70%)",
                      transform: `scale(${activeLink === link.name ? 1.4 : 1})`,
                      opacity: activeLink === link.name ? 0.7 : 0,
                      transition: "transform 0.5s ease, opacity 0.5s ease",
                    }}
                  />
                </div>
              </a>
            ))}
          </div>

          {/* Multiple highlights to create depth and visual interest
          <div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
            style={{
              opacity: isHovered ? 0.8 : 0.4,
              transition: "opacity 0.5s ease",
            }}
          />

          {/* Edge highlight */}
          {/* <div
            className="absolute inset-0 rounded-lg border border-white/20"
            style={{
              opacity: isHovered ? 0.6 : 0.2,
              transition: "opacity 0.5s ease",
            }}
          />  */}
        </div>
      </div>
    </div>
  );
};

export default SimpleContactCard;
