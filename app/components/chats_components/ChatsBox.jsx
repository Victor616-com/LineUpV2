import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import { ChatsPreview } from "./ChatsPreview";
import { useThreadsPreview } from "../../hooks/useThreadsPreview";

// Build public URL for avatars stored in Supabase Storage
const toAvatar = (path) =>
  path
    ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${path}`
    : null;

export default function ChatsBox() {
  const [currentUserId, setCurrentUserId] = useState(null);

  // 1) Who am I?
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data?.user?.id || null);
    })();
  }, []);

  // 2) Base preview rows (your existing hook / RPC)
  const { threads: previewRows = [], loading } =
    useThreadsPreview(currentUserId);

  // 3) Enrich: figure out DM partner for 1:1 threads
  const [dmPartnerByThread, setDmPartnerByThread] = useState(new Map());
  const [partnerProfiles, setPartnerProfiles] = useState(new Map());

  // Fetch participants for these threads → find the other person for 1:1
  useEffect(() => {
    if (!currentUserId || previewRows.length === 0) return;

    const threadIds = Array.from(
      new Set(previewRows.map((r) => r.thread_id).filter(Boolean)),
    );
    if (threadIds.length === 0) return;

    (async () => {
      // Get participants for all threads in one shot
      const { data: parts, error } = await supabase
        .from("thread_participants")
        .select("thread_id, user_id")
        .in("thread_id", threadIds);

      if (error) {
        console.error("participants fetch error:", error);
        return;
      }

      // Group by thread and pick DM partner if exactly 2 users
      const map = new Map();
      const partnerIds = new Set();
      const byThread = new Map();

      for (const row of parts || []) {
        if (!byThread.has(row.thread_id)) byThread.set(row.thread_id, []);
        byThread.get(row.thread_id).push(row.user_id);
      }

      for (const [tid, users] of byThread.entries()) {
        const uniq = Array.from(new Set(users));
        if (uniq.length === 2) {
          const other = uniq.find((u) => u !== currentUserId) || null;
          if (other) {
            map.set(tid, other);
            partnerIds.add(other);
          }
        }
      }

      setDmPartnerByThread(map);

      // Fetch partner profiles (name + avatar) in one query
      const ids = Array.from(partnerIds);
      if (ids.length === 0) return;

      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", ids);

      if (pErr) {
        console.error("profiles fetch error:", pErr);
        return;
      }

      const profMap = new Map();
      for (const p of profiles || []) {
        profMap.set(p.id, {
          name: p.name || "",
          avatar: toAvatar(p.avatar_url),
        });
      }
      setPartnerProfiles(profMap);
    })();
  }, [currentUserId, previewRows]);

  // 4) Adapt rows into the shape ChatsPreview expects (plus DM enrichments)
  const adaptedThreads = useMemo(() => {
    return (previewRows || []).map((row) => {
      const tid = row.thread_id;
      const partnerId = dmPartnerByThread.get(tid);
      const partner = partnerId ? partnerProfiles.get(partnerId) : null;

      return {
        id: tid,
        title: row.preview_title || null,
        updatedAt: row.last_time || null,
        messages: row.last_time
          ? [
              {
                id: "last",
                text: row.last_text,
                senderId: null,
                createdAt: row.last_time,
              },
            ]
          : [],
        _unread: row.unread_count ?? 0,

        // DM identity if available (preferred in display)
        _dmName: partner?.name || null,
        _dmAvatar: partner?.avatar || null,

        // Fallback to "last sender" identity if needed
        _lastSenderName: row.last_sender_name || null,
        _lastSenderAvatar: toAvatar(row.last_sender_avatar) || null,
      };
    });
  }, [previewRows, dmPartnerByThread, partnerProfiles]);

  if (!currentUserId)
    return <div className="p-4 text-sm text-gray-500">Authenticating…</div>;
  if (loading)
    return <div className="p-4 text-sm text-gray-500">Loading chats…</div>;

  return (
    <div className="p-3">
      <ChatsPreview
        threads={adaptedThreads}
        currentUserId={currentUserId}
        usersMap={{}} // not needed; we supply names/avatars in-thread
      />
    </div>
  );
}
