import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../supabaseClient";
import { fmtTime, fmtDay, sameDay, initials, UUID_RE } from "../utils/chat.js";
import { useProfilesCache } from "../hooks/useProfilesCache.js";
import { useMarkMessagesAsRead } from "../hooks/useMarkMessagesAsRead.js";
import ChatTopNav from "../components/chats_components/ChatTopNav.jsx";
import SendIcon from "../../assets/images/Send-icon2.svg";
import { UserAuth } from "../context/AuthContext.jsx";
import AddPicButton from "../components/chats_components/AddPicButton.jsx";

const PAGE_SIZE = 30;

// ---------- Message Bubble ----------
function Bubble({ mine, msg, name, avatarUrl, themeColor }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      {/* Avatar (others only) */}
      {!mine && (
        <div className="mr-2">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-200 grid place-items-center text-[10px] font-semibold text-gray-700">
              {initials(name)}
            </div>
          )}
        </div>
      )}

      {/* Bubble + timestamp */}
      <div className="flex flex-col max-w-[75%]">
        {/* Bubble */}
        <div
          className={`rounded-2xl p-xs text-sm break-words ${
            mine
              ? "text-white self-end"
              : "bg-white border border-veryLightGray self-start"
          }`}
          style={
            mine ? { backgroundColor: themeColor || "#000000" } : undefined
          }
        >
          {msg.media_url && (
            <div className="mb-1">
              <img
                src={msg.media_url}
                alt="attachment"
                className="max-h-48 rounded-xl object-cover"
              />
            </div>
          )}

          {msg.text && <div>{msg.text}</div>}
        </div>

        {/* Timestamp */}
        <div
          className={`text-[10px] mt-1 text-gray-500 ${
            mine ? "self-end" : "self-start"
          }`}
        >
          {fmtTime(msg.created_at)}
        </div>
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function ChatView() {
  const { threadId } = useParams();
  const { themeColor } = UserAuth();

  // --- Auth ---
  const [me, setMe] = useState(null);

  // --- Messages state (kept in ASC by created_at) ---
  const [messages, setMessages] = useState([]);

  // --- Paging state ---
  const [oldestLoadedAt, setOldestLoadedAt] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // --- Composer state ---
  const [text, setText] = useState("");

  // Media-related state for the composer
  const [mediaFile, setMediaFile] = useState(null); // raw File object
  const [mediaUrl, setMediaUrl] = useState(null); // public URL from Supabase
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const [isMediaReady, setIsMediaReady] = useState(false); // upload succeeded
  const [isMediaError, setIsMediaError] = useState(false); // upload failed
  const [mediaResetKey, setMediaResetKey] = useState(0); // to reset AddPicButton

  // --- DOM refs ---
  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const isLoadingMoreRef = useRef(false);

  // ---------- 1) Get current user ----------
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setMe(data?.user?.id || null);
    })();
  }, []);

  // ---------- Helper: ensure user is participant in thread ----------
  async function ensureIAmParticipant(tid, uid) {
    const { data, error } = await supabase
      .from("thread_participants")
      .select("thread_id")
      .eq("thread_id", tid)
      .eq("user_id", uid)
      .limit(1);

    if (error) {
      console.error("participant check error:", error);
      return false;
    }
    return (data?.length || 0) > 0;
  }

  // ---------- Helper: fetch one page of messages ----------
  async function fetchPage({ before = null } = {}) {
    let q = supabase
      .from("messages")
      .select("id, thread_id, sender_id, text, media_url, created_at")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);

    // If we have an "oldestLoadedAt", fetch older messages
    if (before) q = q.lt("created_at", before);

    const { data, error } = await q;
    if (error) {
      console.error("messages fetch error:", error);
      return [];
    }

    const rows = (data || []).map((r) => ({
      ...r,
      // placeholders; will be filled by profiles cache
      name: undefined,
      avatar_url: null,
    }));

    // reverse to ASC for display and grouping
    rows.reverse();
    return rows;
  }

  // ---------- 2) Initial load + realtime subscription ----------
  useEffect(() => {
    if (!threadId) return;

    (async () => {
      const page = await fetchPage();
      setMessages(page);
      setOldestLoadedAt(page.length ? page[0].created_at : null);
      setHasMore(page.length === PAGE_SIZE);

      // scroll to bottom after initial load
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        0,
      );
    })();

    // Realtime: append new messages
    const channel = supabase
      .channel(`chat-${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const m = payload.new;
          setMessages((prev) => {
            if (prev.some((x) => x.id === m.id)) return prev; // avoid dupes
            return [...prev, { ...m, name: undefined, avatar_url: null }];
          });

          // auto-scroll on new message
          setTimeout(
            () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
            0,
          );
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      // supabase.removeChannel?.(channel); // if needed for your supabase version
    };
  }, [threadId]);

  // ---------- 3) Infinite scroll up to load older messages ----------
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    async function onScroll() {
      if (isLoadingMoreRef.current || !hasMore) return;

      // When user pulls to top, fetch older page
      if (el.scrollTop <= 0) {
        isLoadingMoreRef.current = true;
        const prevHeight = el.scrollHeight;

        const page = await fetchPage({ before: oldestLoadedAt });
        setMessages((cur) => [...page, ...cur]);
        setOldestLoadedAt(page.length ? page[0].created_at : oldestLoadedAt);
        setHasMore(page.length === PAGE_SIZE);

        // keep viewport anchored after prepend
        setTimeout(() => {
          const newHeight = el.scrollHeight;
          el.scrollTop = newHeight - prevHeight;
          isLoadingMoreRef.current = false;
        }, 0);
      }
    }

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasMore, oldestLoadedAt]);

  // ---------- 4) Media upload helpers ----------

  // Centralized upload function so we can reuse it for "retry"
  async function uploadMedia(file) {
    if (!me) {
      alert("Not authenticated");
      return;
    }

    setIsMediaUploading(true);
    setIsMediaReady(false);
    setIsMediaError(false); // clear previous error state

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${me}/${threadId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("chat_media")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      setIsMediaUploading(false);
      setIsMediaError(true); // mark error so button + message can react
      // keep mediaFile so user can retry
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("chat_media").getPublicUrl(path);

    setMediaUrl(publicUrl);
    setIsMediaUploading(false);
    setIsMediaReady(true);
    setIsMediaError(false);
  }

  // Called by AddPicButton when user selects a file
  async function handleSelectMedia(file) {
    if (!file) return;
    setMediaFile(file);
    await uploadMedia(file);
  }

  // Called by AddPicButton when user taps the button in error state
  async function handleRetryUpload() {
    if (!mediaFile || isMediaUploading) return;
    await uploadMedia(mediaFile);
  }

  // ---------- 5) Send a message ----------
  async function sendMessage(e) {
    e?.preventDefault();
    const body = text.trim();

    // Must have either text or image attached
    if (!body && !mediaUrl) return;

    if (!me) return alert("Not authenticated");
    if (!UUID_RE.test(threadId)) {
      console.error({ threadId });
      return alert("Invalid chat id");
    }

    const ok = await ensureIAmParticipant(threadId, me);
    if (!ok) return alert("You’re not a participant in this chat.");

    const { data, error, status } = await supabase
      .from("messages")
      .insert(
        {
          thread_id: threadId,
          sender_id: me,
          text: body || "",
          media_url: mediaUrl || null,
        },
        { count: "exact" },
      )
      .select("id, thread_id, created_at")
      .single();

    if (error) {
      console.error("Message send error:", { status, error });
      alert(error.message || `Failed to send (HTTP ${status})`);
      return;
    }

    // Reset composer after successful send
    setText("");
    setMediaFile(null);
    setMediaUrl(null);
    setIsMediaReady(false);
    setIsMediaError(false);
    setMediaResetKey((k) => k + 1); // tell AddPicButton to clear preview
  }

  // ---------- 6) Mark messages as read ----------
  useMarkMessagesAsRead(messages, me);

  // ---------- 7) Profiles cache ----------
  const profilesById = useProfilesCache(messages);

  // ---------- 8) Group messages by day, then by consecutive sender ----------
  const grouped = useMemo(() => {
    const days = [];
    let dayBucket = null;
    let lastSender = null;

    for (const raw of messages) {
      const prof = profilesById.get(raw.sender_id);
      const msg = {
        ...raw,
        name: prof?.name ?? raw.name ?? "",
        avatar_url: prof?.avatar_url ?? raw.avatar_url ?? null,
      };

      // New day bucket
      if (!dayBucket || !sameDay(dayBucket.day, msg.created_at)) {
        dayBucket = { day: msg.created_at, groups: [] };
        days.push(dayBucket);
        lastSender = null;
      }

      // New sender group
      if (!lastSender || lastSender !== msg.sender_id) {
        dayBucket.groups.push({
          sender_id: msg.sender_id,
          name: msg.name,
          avatar_url: msg.avatar_url,
          items: [msg],
        });
        lastSender = msg.sender_id;
      } else {
        // Same sender, append to last group
        dayBucket.groups[dayBucket.groups.length - 1].items.push(msg);
      }
    }
    return days;
  }, [messages, profilesById]);

  // ---------- 9) Chat title ----------
  const chatTitle = useMemo(() => {
    if (!me) return "Chat";

    const names = new Set();

    for (const msg of messages) {
      if (msg.sender_id === me) continue;

      const prof = profilesById.get(msg.sender_id);
      const name = prof?.name ?? msg.name ?? "";

      if (name.trim()) {
        names.add(name.trim());
      }
    }

    if (names.size === 0) return "Chat";
    return Array.from(names).join(", ");
  }, [messages, profilesById, me]);

  // ---------- 10) Chat avatar (first non-me message) ----------
  const otherAvatar = useMemo(() => {
    if (!me) return null;

    for (const msg of messages) {
      if (msg.sender_id !== me) {
        const prof = profilesById.get(msg.sender_id);
        return prof?.avatar_url ?? null;
      }
    }

    return null;
  }, [messages, profilesById, me]);

  // ---------- Render ----------
  return (
    <div className="relative h-dvh bg-gray-50">
      {/* Top Nav - fixed */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-veryLightGray">
        <ChatTopNav title={chatTitle} avatarUrl={otherAvatar} />
      </div>

      {/* History (scroll area between top bar and composer) */}
      <div
        ref={listRef}
        className="
          absolute
          left-0 right-0
          overflow-y-auto
          pt-[56px]        /* height of top nav */
          pb-[88px]        /* room for composer + a bit extra */
          h-dvh
          p-3
          bg-gray-50
        "
      >
        {hasMore && (
          <div className="text-center text-xs text-gray-500 mb-2">
            Pull up to load earlier…
          </div>
        )}

        {grouped.map((day) => (
          <div key={day.day} className="mb-4">
            {/* Day separator */}
            <div className="flex items-center my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="mx-3 text-[11px] text-gray-500">
                {fmtDay(day.day)}
              </div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Message groups by sender */}
            {day.groups.map((g, i) => {
              const mine = g.sender_id === me;
              return (
                <div
                  key={i}
                  className={`mt-2 space-y-1 ${
                    mine ? "text-right" : "text-left"
                  }`}
                >
                  {/* Sender name above group for others */}
                  {!mine && (
                    <div className="ml-9 mb-1 text-[11px] text-gray-600">
                      {g.name || "User"}
                    </div>
                  )}

                  {/* Individual bubbles inside group */}
                  {g.items.map((m) => (
                    <Bubble
                      key={m.id}
                      mine={mine}
                      msg={m}
                      name={g.name}
                      avatarUrl={g.avatar_url}
                      themeColor={themeColor}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}

        {/* Error text inside scroll area, above bottom padding */}
        {isMediaError && (
          <div className="px-1 pb-2 text-[11px] text-red-600">
            Couldn’t upload. Check your connection and tap again.
          </div>
        )}

        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Composer - fixed at bottom */}
      <form
        onSubmit={sendMessage}
        className="
          fixed
          bottom-0 left-0 right-0
          z-20
          p-3
          flex items-end gap-2
          bg-white
          
        "
      >
        {/* Add pic button */}
        <AddPicButton
          themeColor={themeColor}
          onSelect={handleSelectMedia}
          isLoading={isMediaUploading}
          isDone={isMediaReady}
          isError={isMediaError}
          onRetry={handleRetryUpload}
          resetKey={mediaResetKey}
        />

        {/* Text input */}
        <textarea
          rows={1}
          value={text}
          placeholder="Type a message…"
          onChange={(e) => {
            // Auto-grow
            e.target.style.height = "44px";
            e.target.style.height = `${e.target.scrollHeight}px`;
            setText(e.target.value);
          }}
          className="flex-1 border border-veryLightGray bg-white rounded-xl px-3 py-2
               text-sm resize-none overflow-hidden focus:outline-none
               focus:ring-2"
          style={{
            height: "44px",
            // add theme ring color
            "--tw-ring-color": themeColor,
          }}
        />

        {/* Send */}
        <button
          type="submit"
          className="flex w-11 h-11 justify-center items-center shrink-0 aspect-square rounded-full"
          style={{ backgroundColor: themeColor }}
        >
          <img src={SendIcon} alt="Send" className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
