import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useThreadsPreview(currentUserId) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    let ignore = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase.rpc("threads_preview_for_user", {
        p_user: currentUserId,
      });
      if (!ignore) {
        if (error) console.error(error);
        setThreads(data || []);
        setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [currentUserId]);

  return { threads, loading };
}
