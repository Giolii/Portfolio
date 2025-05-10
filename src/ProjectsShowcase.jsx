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

// Individual Project Card Component
const ProjectCard = ({ project, index }) => {
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
    }, 100 + index * 200); // Staggered appearance based on index

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
        transitionDelay: `${0.1}s`,
      }}
    >
      <div
        ref={cardRef}
        className="relative rounded-lg overflow-hidden "
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
              <button
                href={projectData.demoLink}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-purple-900/50 hover:shadow-lg hover:shadow-purple-800/50 transition-all duration-300 flex items-center justify-center z-50"
                style={{
                  transform: `translateZ(40px) scale(${isHovered ? 1.05 : 1})`,
                  transition: "transform 0.3s ease-out, shadow 0.3s ease-out",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(projectData.githubLink, "_blank");
                }}
              >
                DEMO
              </button>
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

// Main Projects Showcase Component
const ProjectsShowcase = () => {
  const [titleVisible, setTitleVisible] = useState(false);

  // Intersection observer for the section title
  const [titleRef, isTitleInView] = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "-100px 0px",
  });

  // Example project data - Replace with your actual projects
  const projects = [
    {
      title: "Blue Eye Social",
      image: "/screenshots/blueeye.jpg",
      demoLink: "https://github.com/Giolii/Blue_Eye",
      githubLink: "https://blueeye-production.up.railway.app/",
      techStack: ["React", "Node.js", "MongoDB", "Express"],
    },
    {
      title: "MSN WebChat",
      image: "/screenshots/MSN.jpg",
      demoLink: "#",
      githubLink: "#",
      techStack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    },
    {
      title: "My Blog as a Admin ",
      image: "/screenshots/blog.jpg",
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
            className="happy p-4 text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200 inline-block"
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
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsShowcase;
