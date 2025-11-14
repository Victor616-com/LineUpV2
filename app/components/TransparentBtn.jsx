import React from "react";

function TransparentBtn({
  loading = false,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  children,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-[#686972] border border-[#aaaaaa] flex-1 px-[28px] flex flex-row gap-xxs items-center py-xs rounded-medium cursor-pointer text-m text-white ${className}`}
      type={type}
    >
      {loading ? loadingText : children}
    </button>
  );
}

export default TransparentBtn;
