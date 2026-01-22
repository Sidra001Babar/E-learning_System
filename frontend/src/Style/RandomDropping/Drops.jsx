import React from "react";
import "./Dropping.css"; // we'll keep CSS in a separate file

const DropsBackground = () => {
  // generate 30 drops with random positions and delays
  const drops = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 20}s`,
  }));

  return (
    <div className="drops-container">
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="drop"
          style={{
            top: drop.top,
            left: drop.left,
            animationDelay: drop.delay,
          }}
        ></div>
      ))}
    </div>
  );
};

export default DropsBackground;
