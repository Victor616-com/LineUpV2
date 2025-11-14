import React, { useState, useEffect } from "react";
import profilePic from "../../assets/images/profile-placeholder.png";
import TagSelector from "../components/NoteTagSelector";
import NoteInputField from "../components/NoteInputField";
import AddMediaBtn from "../components/AddMediaBtn";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";
import YellowBtn from "../components/YellowBtn";
import { useNavigate } from "react-router";

function CreatePage() {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [profile, setProfile] = useState(null);
  const { session } = UserAuth(); // current session
  const navigate = useNavigate();
  // Fetch user profile from profiles table
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return; // guard

      const { data, error } = await supabase
        .from("profiles")
        .select("name, avatar_url, bio, about_me, looking_for, genres")
        .eq("id", session.user.id)
        .single();

      if (error) console.error("Error loading profile:", error);
      else setProfile(data);
    };

    fetchProfile();
  }, [session]);

  const handlePost = async () => {
    if (!session) {
      alert("You must be logged in to post!");

      return;
    }

    setLoading(true);

    if (!title || title.trim().length === 0) {
      setError("Please enter a title");
      setLoading(false);
      return;
    }
    setError("");
    const { error } = await supabase.from("notes").insert([
      {
        title,
        description,
        media_url: mediaUrl, // ✅ No upload needed here
        tags: tags.length > 0 ? tags : null,
        user_id: session.user.id,
      },
    ]);

    if (error) console.error("Insert error:", error);
    else {
      setTitle("");
      setDescription("");
      setMedia(null);
      setMediaUrl(null);
      setTags([]);
      setLoading(false);
      navigate("/home");
    }
  };

  return (
    <div className="px-s flex flex-col gap-[25px] w-full pb-20">
      <div className="flex flex-row gap-xs items-center w-full">
        <img
          className="w-10 h-10 rounded-full object-cover ring-1 ring-white"
          src={
            profile?.avatar_url
              ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${profile.avatar_url}`
              : profilePic
          }
          alt="profile"
        />
        <p className="text-m">{profile?.name || "Profile Name"}</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <TagSelector onSave={(updatedTags) => setTags(updatedTags)} />

      <NoteInputField
        value={title}
        onChange={(v) => {
          setTitle(v);
          setError(""); // ✅ clear error on input change
        }}
        placeholder="Write a title"
      />

      <AddMediaBtn
        media={async (file) => {
          setMedia(file); // still store local preview if needed

          // Upload right away
          const fileName = `${Date.now()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from("notes_media")
            .upload(fileName, file);

          if (error) {
            console.error("Upload error:", error);
            return;
          }

          const publicUrl = supabase.storage
            .from("notes_media")
            .getPublicUrl(fileName).data.publicUrl;

          setMediaUrl(publicUrl); // ✅ Save URL for use later
        }}
      />

      <NoteInputField
        as="textarea"
        value={description}
        onChange={setDescription}
        placeholder="Write your post..."
      />
      <div className="w-full flex justify-end">
        <YellowBtn
          loading={loading}
          loadingText="posting..."
          onClick={handlePost}
        >
          Post
        </YellowBtn>
      </div>
    </div>
  );
}

export default CreatePage;
