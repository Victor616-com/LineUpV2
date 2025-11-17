import React, { useState, useMemo } from "react";
import SearchInput from "./SearchInput";
import ProfileTag from "./ProfileTag";
import NoteTag from "./NoteTag";
import xIcon from "../../assets/images/x-icon.svg";

const plusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M5.05263 11.0526C5.05263 11.3039 5.15244 11.5449 5.33011 11.7225C5.50778 11.9002 5.74874 12 6 12C6.25126 12 6.49222 11.9002 6.66989 11.7225C6.84756 11.5449 6.94737 11.3039 6.94737 11.0526V6.94737H11.0526C11.3039 6.94737 11.5449 6.84756 11.7225 6.66989C11.9002 6.49222 12 6.25126 12 6C12 5.74874 11.9002 5.50778 11.7225 5.33011C11.5449 5.15244 11.3039 5.05263 11.0526 5.05263H6.94737V0.947368C6.94737 0.696111 6.84756 0.455144 6.66989 0.277478C6.49222 0.0998118 6.25126 0 6 0C5.74874 0 5.50778 0.0998118 5.33011 0.277478C5.15244 0.455144 5.05263 0.696111 5.05263 0.947368V5.05263H0.947368C0.696111 5.05263 0.455144 5.15244 0.277478 5.33011C0.0998118 5.50778 0 5.74874 0 6C0 6.25126 0.0998118 6.49222 0.277478 6.66989C0.455144 6.84756 0.696111 6.94737 0.947368 6.94737H5.05263V11.0526Z"
      fill="#464646"
    />
  </svg>
);

function TagSelector({
  onSave,
  availableTags,
  buttonName,
  sectionName,
  serchText,
  hashTag,
}) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]); // selected tags
  const [search, setSearch] = useState("");

  // Filter available tags that are not selected and match search
  const filteredTags = useMemo(() => {
    return availableTags.filter(
      (tag) =>
        !tags.includes(tag) && tag.toLowerCase().includes(search.toLowerCase()),
    );
  }, [availableTags, tags, search]);

  const handleAddTag = (tag) => {
    if (tags.length >= 2) return;
    const newTags = [...tags, tag];
    setTags(newTags);
    if (onSave) onSave(newTags); // <-- send updated tags to parent immediately
    if (!availableTags.includes(tag))
      setAvailableTags((prev) => [...prev, tag]);
    setSearch("");
  };

  const handleRemoveTag = (tag) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    if (onSave) onSave(newTags); // <-- send updated tags to parent
  };

  const saveTags = () => {
    if (onSave) onSave(tags);
    setOpen(false);
  };

  return (
    <div className="relative">
      {open ? (
        <div className="w-full flex flex-col gap-s border border-[#b7b7b7] rounded-small px-s py-s bg-white ">
          <div className="flex flex-row justify-between items-center h-[30px]">
            {/* Selected tags */}
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-xs">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    onClick={() => handleRemoveTag(tag)}
                    className="flex flex-row items-center gap-xxs"
                  >
                    <NoteTag hashTag={hashTag}>
                      {tag}
                      <img src={xIcon} alt="" className="ml-[8px]" />
                    </NoteTag>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-m text-black">{sectionName}</p>
            )}

            <button className="text-m text-primary" onClick={saveTags}>
              {tags.length > 0 ? "Done" : "Cancel"}
            </button>
          </div>

          {/* Search input */}
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={serchText}
            icon={true}
          />

          {/* Available tags */}
          <div className="flex flex-wrap gap-xs">
            {filteredTags.map((tag) => (
              <div key={tag} onClick={() => handleAddTag(tag)}>
                <NoteTag hashTag={hashTag}>{tag}</NoteTag>
              </div>
            ))}

            {/* Add new tag if nothing matches */}
            {filteredTags.length === 0 && search.trim() !== "" && (
              <div className="flex items-center mt-2 gap-2">
                <NoteTag hashTag={hashTag}>{search}</NoteTag>
                <button
                  className="text-m text-primary"
                  onClick={() => handleAddTag(search.trim())}
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {tags.length >= 2 && (
            <p className="text-m">
              You can only add up to 2 {sectionName.toLowerCase()}.
            </p>
          )}
        </div>
      ) : (
        <div
          className="flex flex-row justify-between items-center cursor-pointer px-xxs"
          onClick={() => setOpen(true)}
        >
          {tags.length > 0 && (
            <div className="flex flex-row gap-xxs">
              {tags.map((tag) => (
                <NoteTag hashTag={hashTag} key={tag}>
                  {tag}
                </NoteTag>
              ))}
            </div>
          )}

          <div className="flex flex-row gap-xs items-center">
            {plusIcon}
            <p className="text-m">{buttonName}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TagSelector;
