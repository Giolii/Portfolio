import { useState, useEffect, useRef } from "react";

// Reusable hook for detecting when an element is visible in the viewport
const useIntersectionObserver = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when intersection status changes
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

// Enhanced BioCard Component with scroll triggers
const ScrollBioCard = () => {
  // Default rotation values for the permanent 3D effect
  const defaultRotation = { x: 3, y: -5 };

  const [rotation, setRotation] = useState(defaultRotation);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [isHighlightAnimating, setIsHighlightAnimating] = useState(false);
  const cardRef = useRef(null);

  // Use the intersection observer hook to detect when card is in view
  const [sectionRef, isInView] = useIntersectionObserver({
    threshold: 0.3, // Trigger when 30% of the element is visible
    rootMargin: "-100px 0px", // Adjust based on when you want the animation to trigger
  });

  // Handle animations when the component scrolls into view
  useEffect(() => {
    if (!isInView) return;

    // Sequence of animations when section comes into view
    const textTimer = setTimeout(() => {
      setIsTextVisible(true);
    }, 300);

    const highlightTimer = setTimeout(() => {
      setIsHighlightAnimating(true);
    }, 1300);

    return () => {
      clearTimeout(textTimer);
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
  }, [isInView]);

  // Starting rotation for entrance animation
  const initialRotation = { x: 15, y: -25 };

  // Calculate current rotation based on view state
  const currentRotation = {
    x: isInView ? rotation.x : initialRotation.x,
    y: isInView ? rotation.y : initialRotation.y,
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full py-12 transition-opacity duration-1000"
      style={{ opacity: isInView ? 1 : 0 }}
    >
      {/* Decorative background elements */}
      <div
        className="absolute top-1/2 left-0 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl"
        style={{
          opacity: isInView ? 0.8 : 0,
          transform: `translateY(-50%) scale(${isInView ? 1 : 0.5})`,
          transition: "opacity 1.5s ease, transform 1.5s ease",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl"
        style={{
          opacity: isInView ? 0.7 : 0,
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
        {/* Card background with gradient */}
        <div className="relative p-8 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-indigo-800/90 border border-white/10 backdrop-blur-sm">
          {/* Title with special styling */}
          <h2
            className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200"
            style={{
              opacity: isTextVisible ? 1 : 0,
              transform: `translateY(${isTextVisible ? 0 : -20}px)`,
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            Who I am?
          </h2>

          {/* Bio text with animated appearance */}
          <p
            className="text-xl leading-relaxed text-indigo-100/90"
            style={{
              opacity: isTextVisible ? 1 : 0,
              transform: `translateY(${isTextVisible ? 0 : 20}px)`,
              transition: "opacity 0.8s ease, transform 0.8s ease",
              transitionDelay: "0.2s",
            }}
          >
            Former Italian Army paratrooper turned self-taught software
            engineer. After moving to the US, I paid bills waiting tables while
            learning to build WordPress sites. Now I create full-stack
            applications with React and Node.js. My unconventional path gives me
            a unique perspective that balances technical skills with human
            connection—something I bring to every project while continuously
            growing as a developer.
          </p>

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

          {/* Keyword highlight spans - these will animate in sequence */}
          {[
            { text: "Italian Army", left: "5%", top: "35%", delay: 0.7 },
            { text: "software engineer", left: "55%", top: "35%", delay: 1.0 },
            { text: "React", left: "30%", top: "60%", delay: 1.3 },
            { text: "Node.js", left: "50%", top: "60%", delay: 1.6 },
            { text: "unique perspective", left: "20%", top: "75%", delay: 1.9 },
          ].map((keyword, index) => (
            <div
              key={index}
              className="absolute w-16 h-16 rounded-full pointer-events-none"
              style={{
                left: keyword.left,
                top: keyword.top,
                background:
                  "radial-gradient(circle, rgba(167,139,250,0.3) 0%, rgba(167,139,250,0) 70%)",
                transform: `scale(${isInView ? 1 : 0})`,
                opacity: isInView ? 0.6 : 0,
                transition:
                  "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease",
                transitionDelay: `${keyword.delay}s`,
              }}
            />
          ))}

          {/* Small icon elements to add visual interest */}
          <div
            className="absolute bottom-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-indigo-700/30 border border-indigo-400/20"
            style={{
              opacity: isTextVisible ? 1 : 0,
              transform: `scale(${isTextVisible ? 1 : 0})`,
              transition:
                "opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transitionDelay: "1s",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced ProjectCard with scroll triggers
const ScrollProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // Use intersection observer to detect when the card is in view
  const [sectionRef, isInView] = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: "-50px 0px",
  });

  // Set visibility with delay based on the card's index
  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200 + index * 200); // Staggered appearance based on index

    return () => clearTimeout(timer);
  }, [isInView, index]);

  // Handle mouse movement for 3D effect
  useEffect(() => {
    if (!cardRef.current || !isVisible) return;

    const handleMouseMove = (e) => {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();

      // Calculate if mouse is over the card
      const isOver =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      setIsHovered(isOver);

      if (isOver) {
        // Calculate rotation based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const rotateY = ((mouseX - centerX) / centerX) * 10;
        const rotateX = ((centerY - mouseY) / centerY) * 10;

        setRotation({ x: rotateX, y: rotateY });
      } else {
        // Reset rotation when not hovered
        setRotation({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isVisible]);

  const projectData = {
    title: project?.title || `Project ${index + 1}`,
    image: project?.image || "/api/placeholder/400/250",
    demoLink: project?.demoLink || "#",
    githubLink: project?.githubLink || "#",
    techStack: project?.techStack || ["React", "Node.js", "MongoDB"],
  };

  return (
    <div
      ref={sectionRef}
      className="relative w-full max-w-sm"
      style={{
        perspective: "1000px",
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 50}px)`,
        transition:
          "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transitionDelay: `${0.1 * index}s`,
      }}
    >
      <div
        ref={cardRef}
        className="relative rounded-lg overflow-hidden"
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${
            rotation.y
          }deg) scale(${isHovered ? 1.05 : 1})`,
          transition: "transform 0.5s ease-out",
          transformStyle: "preserve-3d",
          boxShadow: isHovered
            ? "0 20px 40px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.3)"
            : "0 10px 30px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        {/* Card background with gradient */}
        <div className="bg-gradient-to-br from-indigo-900/90 via-purple-900/95 to-indigo-800/90 border border-white/10 backdrop-blur-sm">
          {/* Project image with shimmer effect */}
          <div className="relative overflow-hidden">
            <img
              src={projectData.image}
              alt={projectData.title}
              className="w-full h-48 object-cover"
              style={{
                transform: `scale(${isHovered ? 1.05 : 1}) translateZ(20px)`,
                transition: "transform 0.5s ease-out",
              }}
            />

            {/* Image overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent"
              style={{
                opacity: isHovered ? 0.7 : 0.9,
                transition: "opacity 0.3s ease-out",
              }}
            />

            {/* Shimmer effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                transform: `translateX(${isHovered ? "100%" : "-100%"})`,
                transition: "transform 0.8s ease-out",
              }}
            />
          </div>

          {/* Project content */}
          <div className="p-6">
            {/* Title */}
            <h2
              className="text-2xl font-bold mb-3 text-white"
              style={{
                transform: `translateZ(30px)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              {projectData.title}
            </h2>

            {/* Tech stack */}
            <div
              className="mb-5"
              style={{
                transform: `translateZ(20px)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              <div className="text-indigo-300 text-sm font-medium mb-2">
                Tech Stack:
              </div>
              <div className="flex flex-wrap gap-2">
                {projectData.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded-full bg-indigo-800/50 text-indigo-200 border border-indigo-700/30"
                    style={{
                      transform: `translateZ(20px) scale(${
                        isHovered ? 1.05 : 1
                      })`,
                      transition: "transform 0.3s ease-out",
                      transitionDelay: `${i * 0.05}s`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div
              className="flex gap-4 mt-4"
              style={{
                transform: `translateZ(30px)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              <a
                href={projectData.demoLink}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-purple-900/50 hover:shadow-lg hover:shadow-purple-800/50 transition-all duration-300 flex items-center justify-center"
                style={{
                  transform: `translateZ(40px) scale(${isHovered ? 1.05 : 1})`,
                  transition: "transform 0.3s ease-out, shadow 0.3s ease-out",
                }}
              >
                DEMO
              </a>
              <a
                href={projectData.githubLink}
                className="px-4 py-2 bg-black/30 text-white text-sm font-medium rounded-lg border border-white/10 hover:bg-black/40 hover:border-white/20 transition-all duration-300 flex items-center justify-center"
                style={{
                  transform: `translateZ(40px) scale(${isHovered ? 1.05 : 1})`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                GITHUB
              </a>
            </div>
          </div>

          {/* Card edge highlight */}
          <div
            className="absolute inset-0 rounded-lg border border-white/20"
            style={{
              opacity: isHovered ? 0.8 : 0.2,
              transition: "opacity 0.3s ease-out",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Enhanced ProjectsShowcase with scroll triggers
const ScrollProjectsShowcase = () => {
  const [titleVisible, setTitleVisible] = useState(false);

  // Intersection observer for the section title
  const [titleRef, isTitleInView] = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "-100px 0px",
  });

  // Example project data
  const projects = [
    {
      title: "E-Commerce Platform",
      image: "/api/placeholder/400/250",
      demoLink: "#",
      githubLink: "#",
      techStack: ["React", "Node.js", "MongoDB", "Express"],
    },
    {
      title: "Portfolio Website",
      image: "/api/placeholder/400/250",
      demoLink: "#",
      githubLink: "#",
      techStack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    },
    {
      title: "Task Management App",
      image: "/api/placeholder/400/250",
      demoLink: "#",
      githubLink: "#",
      techStack: ["React", "Firebase", "Material UI"],
    },
  ];

  // Set title visibility when it comes into view
  useEffect(() => {
    if (!isTitleInView) return;

    const timer = setTimeout(() => {
      setTitleVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [isTitleInView]);

  return (
    <div className="relative py-20 w-full">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl"
          style={{
            opacity: isTitleInView ? 0.4 : 0,
            transform: `scale(${isTitleInView ? 1 : 0.5})`,
            transition: "opacity 1.5s ease, transform 1.5s ease",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl"
          style={{
            opacity: isTitleInView ? 0.3 : 0,
            transform: `scale(${isTitleInView ? 1 : 0.5})`,
            transition: "opacity 1.5s ease, transform 1.5s ease",
            transitionDelay: "0.2s",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Title section */}
        <div ref={titleRef} className="mb-16 text-center relative">
          <h2
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 inline-block"
            style={{
              opacity: titleVisible ? 1 : 0,
              transform: `translateY(${titleVisible ? 0 : -20}px)`,
              transition:
                "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            My Projects
          </h2>

          {/* Animated underline */}
          <div
            className="h-1 mt-4 w-24 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            style={{
              opacity: titleVisible ? 1 : 0,
              transform: `scaleX(${titleVisible ? 1 : 0})`,
              transition:
                "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transitionDelay: "0.2s",
            }}
          />
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ScrollProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Scroll-enhanced NameCard
const ScrollNameCard = () => {
  // Default rotation values for the permanent 3D effect
  const defaultRotation = { x: -5, y: 15 };

  const [rotation, setRotation] = useState(defaultRotation);
  const [isHovered, setIsHovered] = useState(false);
  const [hasShimmered, setHasShimmered] = useState(false);
  const cardRef = useRef(null);

  // Use intersection observer to detect when the card is in view
  const [sectionRef, isInView] = useIntersectionObserver({
    threshold: 0.3,
    rootMargin: "-50px 0px",
  });

  // Handle initial mount animation when scrolled into view
  useEffect(() => {
    if (!isInView) return;

    // Trigger shimmer effect after card is in view
    const shimmerTimer = setTimeout(() => {
      setHasShimmered(true);
    }, 1200);

    return () => {
      clearTimeout(shimmerTimer);
    };
  }, [isInView]);

  // Auto animation when not being hovered
  useEffect(() => {
    if (isHovered || !isInView) return;

    let animationFrame;
    let angle = 0;

    const animate = () => {
      // Create a subtle floating animation
      const x = defaultRotation.x + Math.sin(angle * 0.3) * 2;
      const y = defaultRotation.y + Math.cos(angle * 0.2) * 2;

      setRotation({ x, y });
      angle += 0.01;

      animationFrame = requestAnimationFrame(animate);
    };

    // Only start the floating animation after the card has mounted
    if (isInView) {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isHovered, isInView]);

  // Track mouse position globally to avoid hover event conflicts
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
  }, [isInView]);

  // Starting rotation for entrance animation
  const initialRotation = { x: -25, y: 45 };

  // Calculate current rotation based on mount state
  const currentRotation = {
    x: isInView ? rotation.x : initialRotation.x,
    y: isInView ? rotation.y : initialRotation.y,
  };

  return (
    <div
      ref={sectionRef}
      className="flex justify-center items-center p-6"
      style={{ position: "relative", zIndex: 10 }}
    >
      <div
        ref={cardRef}
        className="relative w-96 p-6 bg-gradient-to-br from-indigo-600/80 to-purple-700/80 rounded-lg transition-all duration-500 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${
            currentRotation.x
          }deg) rotateY(${currentRotation.y}deg) scale(${
            isHovered ? 1.08 : isInView ? 1.02 : 0.7
          })`,
          opacity: isInView ? 1 : 0,
          boxShadow: isHovered
            ? "0 35px 60px rgba(0,0,0,0.4), 0 15px 40px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.2)"
            : "0 25px 50px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)",
          transformStyle: "preserve-3d",
          pointerEvents: "none", // Prevents the card from catching mouse events
          transition:
            "opacity 0.8s ease-out, transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          className="flex flex-col items-center gap-3"
          style={{
            transform: `translateZ(${isHovered ? 60 : 40}px) translateY(${
              isInView ? 0 : 30
            }px)`,
            opacity: isInView ? 1 : 0,
            transition:
              "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out",
            transitionDelay: "0.2s",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="rounded-full border-2 border-purple-800 overflow-hidden w-50 h-50"
            style={{
              transform: `translateZ(${isInView ? 0 : -20}px)`,
              opacity: isInView ? 1 : 0,
              transition:
                "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out",
              transitionDelay: "0.3s",
            }}
          >
            <img
              src="https://snworksceo.imgix.net/dpn/459b3d38-cee6-447e-9b33-a529ddc2d155.sized-1000x1000.jpg?w=1000"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div
            style={{
              transform: `translateZ(${isInView ? 0 : -20}px)`,
              opacity: isInView ? 1 : 0,
              transition:
                "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s ease-out",
              transitionDelay: "0.5s",
            }}
          >
            {/* Placeholder for AnimatedAppTitle component */}
            <div className="text-2xl font-bold text-white">Your Name</div>
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
            opacity: hasShimmered ? 0 : isInView ? 0.8 : 0,
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

// Complete Portfolio Demo with Scroll Animations
const ScrollAnimatedPortfolio = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
            DevPortfolio
          </div>

          <nav>
            <ul className="flex space-x-8">
              {["Home", "About", "Projects", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-white/80 hover:text-white transition-colors relative group"
                  >
                    {item}
                    <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Content sections */}
      <div className="relative z-10">
        {/* Hero section */}
        <section id="home" className="py-20">
          <div className="max-w-5xl mx-auto">
            <ScrollNameCard />

            <div className="text-center mt-8 px-4">
              <h1 className="text-4xl font-bold text-white mb-4">
                Full-Stack Developer
              </h1>
              <p className="text-lg text-indigo-200/80 max-w-2xl mx-auto">
                Crafting elegant solutions with modern web technologies
              </p>
            </div>
          </div>
        </section>

        {/* About section */}
        <section id="about" className="py-16 relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-indigo-950/30 -z-10" />
          <div className="max-w-5xl mx-auto px-4">
            <ScrollBioCard />
          </div>
        </section>

        {/* Projects section */}
        <section id="projects" className="relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-indigo-950/30 -z-10" />
          <ScrollProjectsShowcase />
        </section>

        {/* Contact section placeholder */}
        <section id="contact" className="py-20 relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-indigo-950/30 -z-10" />
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Get In Touch</h2>
            <p className="text-lg text-indigo-200/80 max-w-2xl mx-auto mb-8">
              Interested in working together? Contact me to discuss your
              project!
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-purple-900/30 hover:shadow-purple-700/40 relative overflow-hidden group transition-all duration-300">
              Contact Me
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ScrollAnimatedPortfolio;
