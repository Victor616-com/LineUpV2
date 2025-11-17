import React, { useState } from "react";

const COUNTRY_CODES = [
  { code: "+45", flag: "🇩🇰" }, // Denmark
  { code: "+358", flag: "🇫🇮" }, // Finland
  { code: "+354", flag: "🇮🇸" }, // Iceland
  { code: "+47", flag: "🇳🇴" }, // Norway
  { code: "+46", flag: "🇸🇪" }, // Sweden
  { code: "+299", flag: "🇬🇱" }, // Greenland (Denmark)
];

const InputField = ({
  value,
  onChange = () => {},
  label,
  placeholder = "",
  className = "",
  type = "text",
  capitalizeWords,
}) => {
  const isPhone = type === "tel";
  const [selectedCode, setSelectedCode] = useState(COUNTRY_CODES[0]);
  const [localNumber, setLocalNumber] = useState("");

  const handlePhoneChange = (val) => {
    setLocalNumber(val);
    onChange(selectedCode.code + " " + val);
  };

  const handleCountryChange = (e) => {
    const newCode = COUNTRY_CODES.find((c) => c.code === e.target.value);
    setSelectedCode(newCode);
    onChange(newCode.code + " " + localNumber);
  };

  return (
    <div className="flex flex-col gap-s w-full">
      {label && <label className="text-heading3">{label}</label>}

      {isPhone ? (
        <div className="flex items-center gap-s">
          <select
            className="appearance-none h-full bg-white px-xs  text-[24px] border border-[#b7b7b7] rounded-lg outline-none"
            value={selectedCode.code}
            onChange={handleCountryChange}
          >
            {COUNTRY_CODES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag}
              </option>
            ))}
          </select>

          <input
            type="tel"
            placeholder={placeholder}
            className="w-full border border-[#b7b7b7] rounded-lg px-xs py-xs outline-none text-m text-center"
            value={localNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
          />
        </div>
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            let val = e.target.value;

            // ✅ Apply capitalization only if prop is passed
            if (capitalizeWords) {
              val = val
                .toLowerCase()
                .split(" ")
                .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
                .join(" ");
            }

            onChange(val);
          }}
          className={`border border-[#b7b7b7] w-full rounded-lg px-xs py-xs outline-none text-m text-center ${className}`}
        />
      )}
    </div>
  );
};

export default InputField;
