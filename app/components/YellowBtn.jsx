import React from "react";

function YellowBtn({
  children,
  loading = false,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  loadingText = "Loading...",
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`bg-yellow w-fit px-[20px] py-xxs rounded-medium cursor-pointer ${className}`}
      type={type}
    >
      {loading ? loadingText : children}
    </button>
  );
}

export default YellowBtn;
