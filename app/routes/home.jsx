import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Note from "../components/Note";
import { UserAuth } from "../context/AuthContext";
import PrivateRoute from "../components/PrivateRoute";
import { Link } from "react-router";
import Lottie from "lottie-react";
import confettiAnimation from "../../assets/images/confetti.json";

export default function Home() {
  const { session } = UserAuth();
  const [notes, setNotes] = useState([]);
  const [showGif, setShowGif] = useState(false);
  const [lastUserNoteId, setLastUserNoteId] = useState(null);

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
      created_at,
      profiles!inner(name, avatar_url)
    `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        return;
      }

      const formatted = data.map((note) => ({
        id: note.id,
        title: note.title,
        description: note.description,
        media_url: note.media_url,
        user_id: note.user_id,
        name: note.profiles?.name,
        avatar_url: note.profiles?.avatar_url,
        tags: note.tags,
        created_at: note.created_at,
      }));
      setNotes(formatted);

      const userNotes = formatted.filter(
        (note) => note.user_id === session?.user?.id,
      );

      if (userNotes.length > 0) {
        const latestNote = userNotes[0]; // most recent note
        const noteTime = new Date(`${latestNote.created_at}Z`).getTime(); // Treat as UTC
        const now = Date.now();

        // Only show GIF if note is less than 10 seconds old
        if (now - noteTime <= 10000) {
          setLastUserNoteId(latestNote.id);

          const showTimer = setTimeout(() => setShowGif(true), 500); // small delay
          const hideTimer = setTimeout(() => setShowGif(false), 4000); // hide after 4s

          return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
          };
        }
      }
    };

    fetchNotes();
  }, [session]);

  return (
    <PrivateRoute>
      <main className="font-extrabold text-m px-s flex flex-col gap-s mb-[110px]">
        <h1>Home</h1>
        <div className="flex flex-col gap-m">
          {notes.length ? (
            notes.map((note) => (
              <div key={note.id} className="relative">
                <Note note={note} />
                {showGif && note.id === lastUserNoteId && (
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <Lottie
                      animationData={confettiAnimation}
                      loop={false} // play once
                      autoplay={true} // start automatically
                      style={{
                        width: "100%",
                        height: "100%",
                        transform: "scale(2) rotate(90deg)",
                      }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No notes yet.</p>
          )}
        </div>
      </main>
    </PrivateRoute>
  );
}
