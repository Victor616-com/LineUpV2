import React, { useState } from "react";

function CreateSelector({ selected, setSelected }) {
  function Button({ label }) {
    const value = label.toLowerCase();
    const isActive = selected === value;

    return (
      <button
        onClick={() => setSelected(value)}
        className={`text-m text-black px-4 py-2 rounded-full ${
          isActive ? "bg-yellow " : "bg-transparent"
        }`}
      >
        {label}
      </button>
    );
  }
  return (
    <div className="flex flex-row justify-center gap-6">
      <Button label="Note"></Button>
      <Button label="Request"></Button>
    </div>
  );
}

export default CreateSelector;
