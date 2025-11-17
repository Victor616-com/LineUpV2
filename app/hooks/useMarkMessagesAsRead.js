// A hook to mark messages as read for the current user
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export function useMarkMessagesAsRead(messages, me) {
  useEffect(() => {
    if (!me || !messages?.length) return;

    const unreadRows = messages
      .filter((m) => m.sender_id !== me)
      .map((m) => ({
        message_id: m.id,
        user_id: me,
        status: "read",
      }));

    if (!unreadRows.length) return;

    (async () => {
      const { error } = await supabase
        .from("message_status")
        .upsert(unreadRows, { onConflict: "message_id,user_id" });

      if (error) {
        console.error("markMessagesAsRead error:", error);
      }
    })();
  }, [messages, me]);
}
