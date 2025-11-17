// A top navigation bar component for chat interface.
import React from "react";

export default function ChatTopNav({ title, onBack, rightSlot }) {
  return (
    <div className="sticky top-0 z-20 flex items-center h-12 px-3 border-b border-veryLightGray bg-white">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mr-3 text-lg leading-none"
          aria-label="Go back"
        >
          ←
        </button>
      )}

      <div className="flex-1 font-medium text-sm truncate">{title}</div>

      {rightSlot && (
        <div className="ml-2 flex items-center gap-2">{rightSlot}</div>
      )}
    </div>
  );
}
