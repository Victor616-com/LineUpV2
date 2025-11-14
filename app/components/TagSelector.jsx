// components/TagSelector.jsx
import React, { useState } from "react";
import ProfileTag from "./ProfileTag";
import SearchInput from "./SearchInput";
import { supabase } from "../supabaseClient";

const TagSelector = ({ userId, fieldName, initialTags, allOptions, label }) => {
  const [tags, setTags] = useState(initialTags || []);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);
  const [allTags, setAllTags] = useState(allOptions || []);

  const filteredTags = allTags.filter(
    (tag) =>
      !tags.includes(tag) && tag.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddTag = (tag) => {
    if (!allTags.includes(tag)) setAllTags((prev) => [...prev, tag]);
    if (!tags.includes(tag)) setTags((prev) => [...prev, tag]);
    setSearch("");
  };

  const handleRemoveTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const saveTags = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ [fieldName]: tags })
      .eq("id", userId);
    if (error) console.error(`Error updating ${fieldName}:`, error.message);
    setEditing(false);
  };

  return (
    <div className="flex flex-col mt-[15px] gap-s">
      <p className="text-m">{label}</p>

      {!editing ? (
        <div className="flex flex-row flex-wrap gap-xxs items-center">
          {tags && tags.length > 0 ? (
            tags.map((tag) => <ProfileTag key={tag}>{tag}</ProfileTag>)
          ) : (
            <span className="text-gray-400 cursor-pointer">Empty</span>
          )}
          <button
            className="text-m text-primary ml-auto"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-s">
          {/* Selected tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-xxs">
              {tags.map((tag) => (
                <button key={tag} onClick={() => handleRemoveTag(tag)}>
                  <ProfileTag>{tag}</ProfileTag>
                </button>
              ))}
            </div>
          )}

          {/* Search input */}
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search tags..."
            icon={true}
          />

          {/* Available tags */}
          <div className="flex flex-wrap gap-xxs mt-1">
            {filteredTags.map((tag) => (
              <button
                key={tag}
                className="px-xs py-xxs rounded-small border border-gray-300"
                onClick={() => handleAddTag(tag)}
              >
                {tag}
              </button>
            ))}

            {/* Add new tag if nothing matches */}
            {filteredTags.length === 0 && search.trim() !== "" && (
              <div className="flex items-center mt-2 gap-2">
                <ProfileTag>{search}</ProfileTag>
                <button
                  className="text-m text-primary"
                  onClick={() => handleAddTag(search.trim())}
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <button
            className="text-m text-primary mt-2 self-end"
            onClick={saveTags}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
