import React from "react";

function SliderButton({ on, onToggle }) {
  return (
    <div
      onClick={() => onToggle(!on)}
      className={`
        w-15 h-7 flex items-center rounded-full px-1 py-3 cursor-pointer
        transition-colors duration-300
        ${on ? "bg-yellow" : "bg-searchBox"}
      `}
    >
      <div
        className={`
          w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${on ? "translate-x-8" : "translate-x-0"}
        `}
      ></div>
    </div>
  );
}

export default SliderButton;
