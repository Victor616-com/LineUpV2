import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Note from "./Note";

function ProfileNotes({ userId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select(
          `
          id,
          title,
          description,
          media_url,
          tags,
          user_id,
          profiles(name, avatar_url)
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        const formatted = data.map((note) => ({
          ...note,
          name: note.profiles?.name,
          avatar_url: note.profiles?.avatar_url,
        }));

        setNotes(formatted);
      }

      setLoading(false);
    };

    fetchNotes();
  }, [userId]);

  if (loading)
    return <p className="text-center text-gray-500">Loading notes...</p>;
  if (!notes.length)
    return <p className="text-center text-gray-500">No notes yet.</p>;

  return (
    <div className="flex flex-col gap-m px-s">
      {notes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
    </div>
  );
}

export default ProfileNotes;
