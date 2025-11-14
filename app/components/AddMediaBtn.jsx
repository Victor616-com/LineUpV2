import React, { useRef, useState, useEffect } from "react";
import YellowBtn from "./YellowBtn";

const plus = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="9"
    height="9"
    viewBox="0 0 9 9"
    fill="none"
  >
    <path
      d="M3.78947 8.28947C3.78947 8.47792 3.86433 8.65864 3.99758 8.79189C4.13083 8.92514 4.31156 9 4.5 9C4.68844 9 4.86917 8.92514 5.00242 8.79189C5.13567 8.65864 5.21053 8.47792 5.21053 8.28947V5.21053H8.28947C8.47792 5.21053 8.65864 5.13567 8.79189 5.00242C8.92514 4.86917 9 4.68844 9 4.5C9 4.31156 8.92514 4.13083 8.79189 3.99758C8.65864 3.86433 8.47792 3.78947 8.28947 3.78947H5.21053V0.710526C5.21053 0.522083 5.13567 0.341358 5.00242 0.208108C4.86917 0.0748588 4.68844 0 4.5 0C4.31156 0 4.13083 0.0748588 3.99758 0.208108C3.86433 0.341358 3.78947 0.522083 3.78947 0.710526V3.78947H0.710526C0.522083 3.78947 0.341358 3.86433 0.208108 3.99758C0.0748588 4.13083 0 4.31156 0 4.5C0 4.68844 0.0748588 4.86917 0.208108 5.00242C0.341358 5.13567 0.522083 5.21053 0.710526 5.21053H3.78947V8.28947Z"
      fill="#5C5C5C"
    />
  </svg>
);

function AddMediaBtn({ media }) {
  const [preview, setPreview] = useState(null); // local preview
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // preview only
      media(file); // lift the actual File object to parent
    }
  };

  const handleRemove = () => {
    setPreview(null);
    media(null);
    fileInputRef.current.value = null;
  };

  return (
    <div className="relative w-full">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="uploaded"
            className="rounded-small w-full h-auto object-cover"
          />
          <div className="absolute bottom-4 right-4">
            <YellowBtn onClick={handleRemove}>Remove</YellowBtn>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current.click()}
          className="flex flex-row gap-xxs items-center text-m px-s py-xs rounded-full border border-[#5C5C5C]"
        >
          {plus}Add media
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default AddMediaBtn;
