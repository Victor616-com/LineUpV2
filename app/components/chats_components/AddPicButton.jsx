// AddPicButton.jsx
import React, { useRef, useState, useEffect } from "react";

export default function AddPicButton({
  themeColor,
  onSelect,
  isLoading,
  isDone,
  isError, // 👈 new
  onRetry, // 👈 new
  resetKey, // existing
}) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const openFilePicker = () => {
    if (isLoading) return;

    // In error state → tap = retry
    if (isError && onRetry) {
      onRetry();
      return;
    }

    if (fileRef.current) fileRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onSelect(file);
    }
  };

  // cleanup preview URL on unmount / change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // reset when parent changes resetKey
  useEffect(() => {
    if (!resetKey) return;
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    if (fileRef.current) fileRef.current.value = null;
  }, [resetKey]);

  return (
    <>
      <button
        type="button"
        onClick={openFilePicker}
        className="relative flex w-8 h-8 justify-center items-center shrink-0 
                  aspect-square rounded-full overflow-hidden"
        style={{ backgroundColor: themeColor }}
      >
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* overlay for loading / done / error */}
        {(isLoading || isDone || isError) && preview && (
          <div
            className={
              "absolute inset-0 " + (isError ? "bg-red-600/50" : "bg-black/35")
            }
          />
        )}

        {/* error icon */}
        {isError && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="z-10"
          >
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="13" />
            <circle cx="12" cy="16.5" r="0.8" />
          </svg>
        )}

        {/* loading spinner */}
        {!isError && isLoading && (
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full z-10" />
        )}

        {/* success check */}
        {!isError && !isLoading && isDone && (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="z-10"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        )}

        {/* default plus icon */}
        {!preview && !isLoading && !isDone && !isError && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M7 2v10M2 7h10" />
          </svg>
        )}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
