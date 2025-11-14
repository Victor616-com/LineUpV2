import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { supabase } from "../supabaseClient";
import TagSelector from "../components/TagSelector";

import profileImg from "../../assets/images/profile-placeholder.png";
const EditProfileView = () => {
  const { id } = useParams(); // The profile user ID from URL
  const [profile, setProfile] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const [allTags, setAllTags] = useState([
    "Band",
    "Jam Sessions",
    "New Friends",
    "Collaboration",
    "Live Shows",
    "Networking",
  ]); // predefined options
  const [tagSearch, setTagSearch] = useState("");

  const [editingLookingFor, setEditingLookingFor] = useState(false);

  console.log(currentUserId, id);
  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, avatar_url, bio, about_me, looking_for, genres")
        .eq("id", id)
        .single();

      if (error) console.error("Error loading profile:", error);
      else setProfile(data);
    };

    fetchProfile();
  }, [id]);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data?.user?.id || null);
    };
    getUser();
  }, []);

  // Function to update profile fields
  const updateProfileField = async (field, value) => {
    const normalizedValue = value?.trim() === "" ? null : value;
    setProfile((prev) => ({ ...prev, [field]: normalizedValue })); // optimistic UI

    const { error } = await supabase
      .from("profiles")
      .update({ [field]: normalizedValue })
      .eq("id", id);

    if (error) console.error(`Error updating ${field}:`, error.message);
  };

  if (!profile)
    return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="bg-white">
      {/* Profile image */}
      <div className="flex flex-col items-center justify-center gap-s mt-[10px]">
        <img
          className="w-[110px] h-[110px] rounded-full object-cover ring-1 ring-white"
          src={
            profile?.avatar_url
              ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${profile.avatar_url}`
              : profileImg
          }
          alt="profile"
        />

        {/* Label for edit */}
        <label htmlFor="avatarUpload" className="text-m font-bold">
          {uploading ? "Uploading..." : "Edit pictue"}
        </label>
        <input
          type="file"
          id="avatarUpload"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setUploading(true);
            const filePath = `${currentUserId}/${file.name}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
              .from("profile_images")
              .upload(filePath, file, { upsert: true });

            if (uploadError) {
              console.error("Upload error:", uploadError.message);
            } else {
              // Update profile with new avatar_url
              const { error: updateError } = await supabase
                .from("profiles")
                .update({ avatar_url: filePath })
                .eq("id", currentUserId);

              if (updateError)
                console.error("Update profile error:", updateError.message);
              else setProfile((prev) => ({ ...prev, avatar_url: filePath }));
            }

            setUploading(false);
          }}
        />
      </div>

      <div className="flex flex-col px-s">
        {/* Main box */}
        <div className="flex flex-col p-s border border-veryLightGray rounded-small mt-[20px]">
          {/* Name */}
          <div className="flex flex-row ">
            <div className="w-[100px] py-xs">
              <p className="text-m">Name</p>
            </div>
            <div className="flex-1 flex flex-row justify-between border-b border-veryLightGray py-xs">
              {editingField === "name" ? (
                <input
                  autoFocus
                  className="w-full bg-transparent outline-none text-m"
                  value={profile.name || ""}
                  onChange={(e) => {
                    const value = e.target.value
                      .split(" ")
                      .map((word) =>
                        word.length > 0
                          ? word.charAt(0).toUpperCase() + word.slice(1)
                          : "",
                      )
                      .join(" ");

                    setProfile((prev) => ({ ...prev, name: value }));
                  }}
                  onBlur={() => {
                    updateProfileField("name", profile.name || "");
                    setEditingField(null);
                  }}
                />
              ) : (
                <p
                  className="text-m w-full cursor-pointer"
                  onClick={() => setEditingField("name")}
                >
                  {profile.name || <span className="text-gray-400">Empty</span>}
                </p>
              )}
              {editingField === "name" && (
                <button
                  className="text-m w-fit pr-xxs text-primary"
                  onClick={() => {
                    updateProfileField("name", profile.name || "");
                    setEditingField(null);
                  }}
                >
                  Done
                </button>
              )}
            </div>
          </div>
          {/* Bio */}
          <div className="flex flex-row">
            <div className="w-[100px] py-xs">
              <p className="text-m">Bio</p>
            </div>
            <div className="flex-1 flex flex-row justify-between border-b border-veryLightGray py-xs">
              {editingField === "bio" ? (
                <input
                  autoFocus
                  className="w-full bg-transparent outline-none text-m"
                  value={profile.bio || ""}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  onBlur={() => {
                    updateProfileField("bio", profile.bio);
                    setEditingField(null);
                  }}
                />
              ) : (
                <p
                  className="text-m w-full cursor-pointer"
                  onClick={() => setEditingField("bio")}
                >
                  {profile.bio || <span className="text-gray-400">Empty</span>}
                </p>
              )}
              {editingField === "bio" && (
                <button
                  className="text-m w-fit pr-xxs text-primary"
                  onClick={() => {
                    updateProfileField("bio", profile.bio);
                    setEditingField(null);
                  }}
                >
                  Done
                </button>
              )}
            </div>
          </div>
          {/* About me */}
          <div className="flex flex-row items-center">
            <p className="text-m w-[100px] h-fit">About me</p>

            <div className="flex-1 border-b border-veryLightGray py-xs flex flex-col gap-2">
              {editingField === "about_me" ? (
                <textarea
                  autoFocus
                  ref={(el) => {
                    if (el) {
                      el.style.height = "16px";
                      el.style.height = el.scrollHeight + "px";
                      el.selectionStart = el.selectionEnd = el.value.length;
                    }
                  }}
                  className="w-full bg-transparent outline-none text-m resize-none overflow-hidden"
                  value={profile.about_me || ""}
                  onChange={(e) => {
                    // Auto adjust height
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";

                    setProfile((prev) => ({
                      ...prev,
                      about_me: e.target.value,
                    }));
                  }}
                  onBlur={() => {
                    updateProfileField("about_me", profile.about_me || "");
                    setEditingField(null);
                  }}
                />
              ) : (
                <p
                  className="flex-1 text-m w-full cursor-pointer whitespace-pre-wrap wrap-anywhere"
                  onClick={() => setEditingField("about_me")}
                >
                  {profile.about_me || (
                    <span className="text-gray-400">Empty</span>
                  )}
                </p>
              )}

              {editingField === "about_me" && (
                <button
                  className="text-m w-fit ml-auto text-primary"
                  onClick={() => {
                    updateProfileField("about_me", profile.about_me || "");
                    setEditingField(null);
                  }}
                >
                  Done
                </button>
              )}
            </div>
          </div>

          {/* Looking for */}
          <TagSelector
            userId={id}
            fieldName="looking_for"
            initialTags={profile.looking_for}
            allOptions={[
              "Band",
              "Jam Sessions",
              "New Friends",
              "Collaboration",
              "Live Shows",
              "Networking",
            ]}
            label="What am I looking for"
          />
          <TagSelector
            userId={id}
            fieldName="genres"
            initialTags={profile.genres}
            allOptions={[
              "Rock",
              "Jazz",
              "Pop",
              "Blues",
              "Hip-hop",
              "Electronic",
            ]}
            label="Genres"
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfileView;
