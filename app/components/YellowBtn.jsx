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
      className={`bg-yellow flex flex-row gap-1 w-fit px-5 py-xs rounded-medium cursor-pointer ${className}`}
      type={type}
    >
      {loading ? loadingText : children}
    </button>
  );
}

export default YellowBtn;
