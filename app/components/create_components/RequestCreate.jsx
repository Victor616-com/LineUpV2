import React, { useState } from "react";
import { useNavigate } from "react-router";
import { UserAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import NoteInputField from "../NoteInputField";
import AddMediaBtn from "../AddMediaBtn";
import TagSelector from "../CreateTagSelector";
import SliderButton from "../SliderButton";
import YellowBtn from "../YellowBtn";

function RequestCreate() {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState(null);
  const [tags, setTags] = useState([]);
  const [location, setLocation] = useState("");
  const [paid, setPaid] = useState(false);
  const [remote, setRemote] = useState(false);
  const { session } = UserAuth(); // current session
  const navigate = useNavigate();
  const [locationFocused, setLocationFocused] = useState(false);
  const [showRemote, setShowRemote] = useState(false);

  const [availableTags, setAvailableTags] = useState([
    "Alternative",
    "Rock",
    "Metal",
    "Pop",
    "Rap",
    "R&B",
    "Country",
    "Blues",
    "Indie",
  ]);

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

    // Has to be changed to the collab_request table and to add the necessary collumns.
    // Create a media bucket for the collab request and change it in the upload media logic
    const { error } = await supabase.from("notes").insert([
      {
        title,
        description,
        media_url: mediaUrl,
        tags: tags.length > 0 ? tags : null,
        user_id: session.user.id,
      },
    ]);

    if (error) console.error("Insert error:", error);
    else {
      // Set these to the updated ones.
      // I don't think they matter because it redirects you to the home page (change it to send you to /collabs)
      //
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
      {/* Title */}
      <NoteInputField
        value={title}
        onChange={(v) => {
          setTitle(v);
          setError(""); // ✅ clear error on input change
        }}
        placeholder="Write a title"
      />
      {/* Add media */}
      <AddMediaBtn
        media={async (file) => {
          setMedia(file);

          // Upload right away
          const fileName = `${Date.now()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from("notes_media") // Change to the new media bucket
            .upload(fileName, file);

          if (error) {
            console.error("Upload error:", error);
            return;
          }

          const publicUrl = supabase.storage
            .from("notes_media") // Change to the new media bucket
            .getPublicUrl(fileName).data.publicUrl;

          setMediaUrl(publicUrl);
        }}
      />
      {/* Description */}
      <NoteInputField
        as="textarea"
        value={description}
        onChange={setDescription}
        placeholder="Write your request..."
      />
      {/* Genres */}
      <TagSelector
        hashTag={false}
        buttonName="Add genres"
        sectionName="Genres"
        serchText="Serch genres..."
        availableTags={availableTags}
        onSave={(updatedTags) => setTags(updatedTags)}
      />
      {/* Location */}
      <NoteInputField
        value={location}
        onChange={(v) => {
          setLocation(v);
          setError("");
        }}
        placeholder="Add location"
        isFocused={locationFocused}
        setIsFocused={setLocationFocused}
        disabled={remote}
        placeholderOnDisable="Remote"
      />

      {(locationFocused || showRemote) && (
        <div
          className="flex flex-row gap-xs"
          onMouseDown={(e) => e.preventDefault()} // prevents input from losing focus on click
        >
          <SliderButton
            on={remote}
            onToggle={(val) => {
              setRemote(val);
              setShowRemote(val); // keep visible if enabled
              console.log(val);
            }}
          />
          <p className="text-m">Remote</p>
        </div>
      )}
      <div className="flex flex-row gap-xs">
        <SliderButton
          on={paid}
          onToggle={(val) => {
            setPaid(val);
            console.log(val);
          }}
        />
        <p className="text-m">Paid opportunity</p>
      </div>

      {/* Post btn */}
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

export default RequestCreate;
