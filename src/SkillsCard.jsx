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

const SkillsCard = () => {
  // Default rotation values for 3D effect
  const defaultRotation = { x: 2, y: -8 };

  const [rotation, setRotation] = useState(defaultRotation);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const [isHighlightAnimating, setIsHighlightAnimating] = useState(false);
  const cardRef = useRef(null);

  // Skills data with complementary colors and descriptions
  const skills = [
    {
      name: "React",
      color: "from-blue-400 to-cyan-400",
      icon: "⚛️",
      desc: "Component-based UI library",
    },
    {
      name: "Vite",
      color: "from-purple-400 to-fuchsia-400",
      icon: "⚡",
      desc: "Next-gen frontend tooling",
    },
    {
      name: "Node.js",
      color: "from-green-400 to-emerald-400",
      icon: "🟢",
      desc: "JavaScript runtime",
    },
    {
      name: "PostgreSQL",
      color: "from-blue-500 to-indigo-500",
      icon: "🐘",
      desc: "Relational database",
    },
    {
      name: "Express",
      color: "from-gray-400 to-slate-500",
      icon: "🚂",
      desc: "Web framework for Node.js",
    },
    {
      name: "Tailwind",
      color: "from-cyan-400 to-blue-500",
      icon: "🎨",
      desc: "Utility-first CSS framework",
    },
    {
      name: "WebSocket",
      color: "from-indigo-400 to-purple-500",
      icon: "🔄",
      desc: "Real-time communication protocol",
    },
    {
      name: "Jest",
      color: "from-red-400 to-rose-500",
      icon: "🧪",
      desc: "Testing framework",
    },
  ];

  // Use intersection observer to detect when card is in view
  const [sectionRef, isInView] = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: "-50px 0px",
  });

  // Handle animations when component scrolls into view
  useEffect(() => {
    if (!isInView) return;

    // Trigger highlight animation when card comes into view
    const highlightTimer = setTimeout(() => {
      setIsHighlightAnimating(true);
    }, 800);

    return () => {
      clearTimeout(highlightTimer);
    };
  }, [isInView]);

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
  const initialRotation = { x: 12, y: -20 };

  // Calculate current rotation based on view state
  const currentRotation = {
    x: isInView ? rotation.x : initialRotation.x,
    y: isInView ? rotation.y : initialRotation.y,
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full py-12"
      style={{
        opacity: isInView ? 1 : 0,
        transition: "opacity 0.8s ease-out",
      }}
    >
      {/* Decorative background elements */}
      <div
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl"
        style={{
          opacity: isInView ? 0.6 : 0,
          transform: `scale(${isInView ? 1 : 0.5})`,
          transition: "opacity 1.5s ease, transform 1.5s ease",
        }}
      />
      <div
        className="absolute bottom-1/3 left-1/6 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl"
        style={{
          opacity: isInView ? 0.5 : 0,
          transform: `scale(${isInView ? 1 : 0.5})`,
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
        <div className="relative p-8 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-indigo-800/90 border border-white/10 backdrop-blur-sm">
          {/* Title with special styling */}
          <h2
            className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 text-center"
            style={{
              opacity: isInView ? 1 : 0,
              transform: `translateY(${isInView ? 0 : -20}px)`,
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            My Skills
          </h2>

          {/* Skills grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className="relative"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: `translateY(${isInView ? 0 : 20}px)`,
                  transition:
                    "opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transitionDelay: `${0.2 + index * 0.1}s`,
                }}
              >
                <div
                  className={`group relative cursor-pointer`}
                  onMouseEnter={() => setActiveSkill(skill.name)}
                  onMouseLeave={() => setActiveSkill(null)}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${skill.color} border border-white/20 text-white flex items-center gap-2 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    style={{
                      transform: `translateZ(20px) scale(${
                        activeSkill === skill.name ? 1.05 : 1
                      })`,
                      opacity: activeSkill === skill.name ? 1 : 0.85,
                      transition:
                        "transform 0.3s ease-out, opacity 0.3s ease-out, shadow 0.3s ease-out",
                    }}
                  >
                    <span className="text-xl">{skill.icon}</span>
                    <span className="font-medium">{skill.name}</span>
                  </div>

                  {/* Pulse effect when active */}
                  <div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-30 blur-md`}
                    style={{
                      transform: `translateZ(10px) scale(${
                        activeSkill === skill.name ? 1.2 : 1
                      })`,
                      transition:
                        "transform 0.3s ease-out, opacity 0.3s ease-out",
                    }}
                  />

                  {/* Skill description tooltip */}
                  <div
                    className="absolute -bottom-16 left-0 right-0 bg-black/80 backdrop-blur-md text-white text-sm p-2 rounded-md border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity duration-200"
                    style={{
                      transform: "translateZ(50px)",
                      maxWidth: "150px",
                    }}
                  >
                    {skill.desc}
                    <div className="absolute -top-2 left-1/2 w-4 h-4 bg-black/80 transform -translate-x-1/2 rotate-45 border-t border-l border-white/10" />
                  </div>
                </div>
              </div>
            ))}
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
              opacity: isInView ? 1 : 0,
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
        </div>
      </div>
    </div>
  );
};

export default SkillsCard;
