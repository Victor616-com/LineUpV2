import React from "react";

function ProgressBar({ width = "0%" }) {
  return (
    <div className="h-[6px] w-[260px] bg-[#EDEDED] rounded-full mt-[30px] ">
      <div
        className="h-full bg-yellow rounded-full transition-all duration-300"
        style={{ width }}
      ></div>
    </div>
  );
}

export default ProgressBar;
