import React from "react";

function NoteTag({ children }) {
  return (
    <div className="w-fit flex flex-row items-center justify-center px-2 py-[2px] rounded-full border border-[#555555]">
      <p className="text-m">#</p>
      {children}
    </div>
  );
}

export default NoteTag;
