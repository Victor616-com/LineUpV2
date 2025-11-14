import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Note from "../components/Note";
import { UserAuth } from "../context/AuthContext";
import PrivateRoute from "../components/PrivateRoute";
import { Link } from "react-router";

export default function Home() {
  const { session } = UserAuth();
  const [notes, setNotes] = useState([]);

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
          user_id,
          tags,
          profiles!inner(name, avatar_url)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
      } else {
        // Flatten the profile info
        const formatted = data.map((note) => ({
          id: note.id,
          title: note.title,
          description: note.description,
          media_url: note.media_url,
          user_id: note.user_id,
          name: note.profiles?.name,
          avatar_url: note.profiles?.avatar_url,
          tags: note.tags,
        }));
        setNotes(formatted);
      }
    };

    fetchNotes();
  }, []);

  return (
    <PrivateRoute>
      <main className="font-extrabold text-m px-s flex flex-col gap-s mb-[110px]">
        <h1>Home</h1>
        <div className="flex flex-col gap-m">
          {notes.length ? (
            notes.map((note) => <Note key={note.id} note={note} />)
          ) : (
            <p>No notes yet.</p>
          )}
        </div>
      </main>
    </PrivateRoute>
  );
}
