import React, { useState } from "react";
import searchIcon from "../../assets/images/search-icon.svg";
import xIcon from "../../assets/images/x-icon.svg";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  onClear, // optional callback when clearing input
  icon = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    if (onClear) onClear();
    onChange(""); // Clear the input
  };

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-[36px] px-2 py-1 pr-10 bg-searchBox rounded-lg text-m text-black placeholder-black outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* Icon on the right */}
      {icon &&
        (isFocused || value ? (
          <img
            src={xIcon}
            alt="clear"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-[16px] h-auto cursor-pointer"
          />
        ) : (
          <img
            src={searchIcon}
            alt="search"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
          />
        ))}
    </div>
  );
};

export default SearchInput;
