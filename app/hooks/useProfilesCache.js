import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toPublicAvatar } from "../utils/chat";

// Keeps a cache of user profiles (id → { name, avatar_url }).
// Fetches profiles only when a sender_id hasn't been seen before.
export function useProfilesCache(messages) {
  const [profilesById, setProfilesById] = useState(new Map());

  useEffect(() => {
    // Find sender_ids that are not in cache yet
    const missing = new Set();
    for (const m of messages) {
      if (!profilesById.has(m.sender_id)) {
        missing.add(m.sender_id);
      }
    }
    if (missing.size === 0) return;

    (async () => {
      const ids = Array.from(missing);

      console.log("🔍 Missing IDs:", ids);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("id", ids);

      console.log("PROFILE ROW:", p);

      console.log("📥 Fetch result:", data);
      console.log("⚠️ Fetch error:", error);

      if (error) {
        console.error("profiles fetch error:", error);
        return;
      }

      // Update cache immutably
      setProfilesById((prev) => {
        const next = new Map(prev);
        for (const p of data || []) {
          next.set(p.id, {
            name: p.name || "",
            avatar_url: toPublicAvatar(p.avatar_url),
          });
        }
        return next;
      });
    })();
  }, [messages]);

  return profilesById;
}
