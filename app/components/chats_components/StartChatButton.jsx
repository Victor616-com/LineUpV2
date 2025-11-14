// src/components/StartChatButton.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router"; // keep your router import style
import { supabase } from "../../supabaseClient";

export default function StartChatButton({
  targetUserId,
  label = "Send Message",
  navigateToChat = true,
  onReady,
  className = "bg-yellow px-m py-xxs rounded-medium cursor-pointer",
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    try {
      setBusy(true);

      // Ensure we have an authenticated user
      const { data: sess } = await supabase.auth.getSession();
      const me = sess?.session?.user?.id ?? null;
      if (!me) return alert("You must be logged in.");
      if (!targetUserId) return alert("No target user.");
      if (me === targetUserId) return alert("You can’t message yourself.");

      // One RPC does it all: find-or-create the DM and return thread_id
      const { data: threadId, error } = await supabase.rpc("start_dm", {
        target_user: targetUserId,
      });
      if (error) throw error;

      onReady?.(threadId);
      if (navigateToChat) navigate(`/chats/${threadId}`);
    } catch (err) {
      console.error("[StartChatButton]", err);
      alert(err.message || "Couldn’t open chat.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={`bg-[#686972] border border-[#aaaaaa] w-fit px-[28px] flex flex-row gap-xxs items-center py-xs rounded-medium cursor-pointer text-m text-white`}
    >
      {busy ? "Opening…" : label}
    </button>
  );
}
