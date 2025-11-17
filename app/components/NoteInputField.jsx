import React, {
  useState,
  useRef,
  useEffect,
  isFocused,
  setIsFocused,
} from "react";

function NoteInputField({
  value,
  onChange,
  placeholder,
  as = "input",
  setIsFocused,
  disabled = false,
  placeholderOnDisable,
}) {
  const [isEditing, setIsEditing] = useState(true);
  const showDone = value.trim().length > 0;
  const textareaRef = useRef(null);

  const handleDone = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Auto-grow textarea height
  useEffect(() => {
    if (as === "textarea" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value, as, isEditing]);

  const baseClasses =
    "w-full px-xs py-xs bg-searchBox rounded-lg text-m text-black placeholder-[#969696] outline-none";

  // Add extra right padding for the button if it's an input
  const inputClasses =
    as === "input" ? `${baseClasses} pr-[60px]` : `${baseClasses} pb-[25px]`;

  /**
   * DISPLAY MODE (NOT EDITING)
   * - For input → same layout
   * - For textarea → text on top, Edit button below
   */
  if (!isEditing) {
    if (as === "textarea") {
      return (
        <div className="w-full px-xs py-xs flex flex-col gap-xs items-end">
          <p className="text-m wrap-break-word w-full">
            {value || <span className="opacity-60">{placeholder}</span>}
          </p>

          <button className="text-m text-primary mt-xs" onClick={handleEdit}>
            Edit
          </button>
        </div>
      );
    }

    // INPUT DISPLAY MODE
    return (
      <div className=" justify-between w-full px-xs py-xs flex flex-row gap-xs items-end text-m text-black">
        <p className="text-heading2 wrap-break-word w-full">
          {value || <span className="opacity-60">{placeholder}</span>}
        </p>

        <button className="text-m text-primary" onClick={handleEdit}>
          Edit
        </button>
      </div>
    );
  }

  /**
   * EDIT MODE
   */
  return (
    <div className="relative w-full">
      {as === "textarea" ? (
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          className={`${inputClasses} overflow-hidden resize-none`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          disabled={disabled}
          type="text"
          placeholder={disabled ? placeholderOnDisable : placeholder}
          className={`${inputClasses}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused?.(true)}
          onBlur={() => setIsFocused?.(false)}
        />
      )}

      {showDone && (
        <button
          onClick={handleDone}
          className={`absolute right-3 text-m text-primary ${
            as === "textarea" ? "bottom-3" : "top-1/2 -translate-y-1/2"
          }`}
        >
          Done
        </button>
      )}
    </div>
  );
}

export default NoteInputField;
