import React, { useState, useEffect } from "react";

const AnimatedAppTitle = () => {
  const [visible, setVisible] = useState(false);
  const [letterClass, setLetterClass] = useState("opacity-0 translate-y-8");
  const appName = "Luigi Olianas";

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setLetterClass("opacity-100 transform-none");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    // <div className="flex flex-col items-center justify-center w-full h-64 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-xl overflow-hidden">
    <>
      <div
        className={`transition-all duration-1000 ease-out koni ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative flex justify-center">
          {appName.split("").map((letter, index) => (
            <span
              key={index}
              className={`text-6xl font-bold text-white inline-block transform transition-all duration-700 delay-${
                index * 100
              } ${letterClass}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div
          className={`h-1 bg-white rounded-full mt-2 transition-all duration-1000 delay-500 ${
            visible ? "w-full opacity-70" : "w-0 opacity-0"
          }`}
        ></div>

        <p
          className={`text-white text-center mt-4 text-lg font-light transition-all duration-1000 delay-700 paul tracking-widest ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          Software Engineer
        </p>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white opacity-10 transition-all duration-2000 ${
              visible ? "scale-100" : "scale-0"
            }`}
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transitionDelay: `${i * 200 + 800}ms`,
            }}
          />
        ))}
      </div>
    </>
    // </div>
  );
};

export default AnimatedAppTitle;
