import { useState } from "react";
import TagSelector from "../CreateTagSelector";
import NoteInputField from "../../components/NoteInputField";
import AddMediaBtn from "../../components/AddMediaBtn";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import YellowBtn from "../../components/YellowBtn";
import { useNavigate } from "react-router";

function NoteCreate() {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [media, setMedia] = useState(null);

  const { session } = UserAuth(); // current session
  const navigate = useNavigate();

  const [availableTags, setAvailableTags] = useState([
    "question",
    "concert",
    "equipment",
    "tutorial",
    "music-theory",
    "recording",
    "guitar",
    "singing",
    "saxophone",
    "keys",
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

    const { data: insertedData, error } = await supabase
      .from("notes")
      .insert([
        {
          title,
          description,
          media_url: mediaUrl,
          tags: tags.length > 0 ? tags : null,
          user_id: session.user.id,
        },
      ])
      .select(); // select inserted row

    if (!error) {
      const newNoteId = insertedData[0].id;
      navigate("/home", { state: { justPostedNoteId: newNoteId } });
    }

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
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <TagSelector
        buttonName="Add tags"
        sectionName="Tags"
        serchText="Serch tags..."
        availableTags={availableTags}
        onSave={(updatedTags) => setTags(updatedTags)}
      />

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

export default NoteCreate;
