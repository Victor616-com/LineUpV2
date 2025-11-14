import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../supabaseClient";

const PAGE_SIZE = 30;

// ---------- Small helpers ----------
function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function fmtDay(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function sameDay(a, b) {
  const da = new Date(a),
    db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}
function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
function toPublicAvatar(urlPath) {
  if (!urlPath) return null;
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${urlPath}`;
}

// ---------- UI: Single bubble ----------
function Bubble({ mine, msg, name, avatarUrl }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
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
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-black text-white" : "bg-white border border-veryLightGray"}`}
      >
        <div>{msg.text}</div>
        <div
          className={`text-[10px] mt-1 ${mine ? "opacity-80" : "text-gray-500"}`}
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

  // auth
  const [me, setMe] = useState(null);

  // messages (kept in ASC by created_at)
  const [messages, setMessages] = useState([]);

  // paging state
  const [oldestLoadedAt, setOldestLoadedAt] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // compose state
  const [text, setText] = useState("");

  // DOM refs
  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const isLoadingMoreRef = useRef(false);

  // cache: sender_id -> { name, avatar_url }
  const [profilesById, setProfilesById] = useState(new Map());

  // ---------- 1) Get current user ----------
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setMe(data?.user?.id || null);
    })();
  }, []);

  // ---------- 2) Fetch one page (newest-first -> reverse to oldest-first) ----------
  async function fetchPage({ before = null } = {}) {
    let q = supabase
      .from("messages")
      .select("id, thread_id, sender_id, text, created_at")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);

    if (before) q = q.lt("created_at", before);

    const { data, error } = await q;
    if (error) {
      console.error("messages fetch error:", error);
      return [];
    }

    const rows = (data || []).map((r) => ({
      ...r,
      // placeholders; will be filled by the profiles cache
      name: undefined,
      avatar_url: null,
    }));

    rows.reverse(); // ASC for rendering/grouping
    return rows;
  }

  // ---------- 3) Initial load + realtime subscription ----------
  useEffect(() => {
    if (!threadId) return;

    (async () => {
      const page = await fetchPage();
      setMessages(page);
      setOldestLoadedAt(page.length ? page[0].created_at : null);
      setHasMore(page.length === PAGE_SIZE);
      // jump to bottom after initial load
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "auto" }),
        0,
      );
    })();

    // Realtime: append new messages (only if user can select via RLS)
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
            if (prev.some((x) => x.id === m.id)) return prev;
            return [...prev, { ...m, name: undefined, avatar_url: null }];
          });
          // auto-scroll on arrival
          setTimeout(
            () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
            0,
          );
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      // supabase.removeChannel?.(channel); // uncomment if using v2 API that supports this
    };
  }, [threadId]);

  // ---------- 4) Infinite scroll up to load older messages ----------
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    async function onScroll() {
      if (isLoadingMoreRef.current || !hasMore) return;
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

  // ---------- 5) Send a message ----------
  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

  async function sendMessage(e) {
    e?.preventDefault();
    const body = text.trim();
    if (!body) return;

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
        { thread_id: threadId, sender_id: me, text: body },
        { count: "exact" },
      )
      .select("id, thread_id, created_at") // forces PostgREST to return detailed errors
      .single();

    if (error) {
      console.error("Message send error:", { status, error });
      alert(error.message || `Failed to send (HTTP ${status})`);
      return;
    }

    setText("");
  }

  // ---------- 5b) Mark messages as read ----------
  async function markMessagesAsRead(msgs) {
    if (!me || !msgs?.length) return;

    const rows = msgs
      .filter((m) => m.sender_id !== me)
      .map((m) => ({ message_id: m.id, user_id: me, status: "read" }));

    if (!rows.length) return;

    const { error } = await supabase
      .from("message_status")
      .upsert(rows, { onConflict: "message_id,user_id" });
    if (error) console.error("markMessagesAsRead error:", error);
  }

  // call it whenever the visible list changes
  useEffect(() => {
    if (messages.length) markMessagesAsRead(messages);
  }, [messages]);

  // ---------- 6) Fetch any missing sender profiles & fill cache ----------
  useEffect(() => {
    // gather sender IDs that we don't have in cache yet
    const missing = new Set();
    for (const m of messages) {
      if (!profilesById.has(m.sender_id)) missing.add(m.sender_id);
    }
    if (missing.size === 0) return;

    (async () => {
      const ids = Array.from(missing);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", ids);

      if (error) {
        console.error("profiles fetch error:", error);
        return;
      }

      // merge into cache
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
  }, [messages, profilesById]);

  // ---------- 7) Group messages by day, then by consecutive sender ----------
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

      if (!dayBucket || !sameDay(dayBucket.day, msg.created_at)) {
        dayBucket = { day: msg.created_at, groups: [] };
        days.push(dayBucket);
        lastSender = null;
      }
      if (!lastSender || lastSender !== msg.sender_id) {
        dayBucket.groups.push({
          sender_id: msg.sender_id,
          name: msg.name,
          avatar_url: msg.avatar_url,
          items: [msg],
        });
        lastSender = msg.sender_id;
      } else {
        dayBucket.groups[dayBucket.groups.length - 1].items.push(msg);
      }
    }
    return days;
  }, [messages, profilesById]);

  if (!me)
    return <div className="p-4 text-sm text-gray-500">Authenticating…</div>;

  // ---------- Render ----------
  return (
    <div className="flex flex-col h-dvh pt-[0px]">
      {/* History */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-3 bg-gray-50 ">
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

            {day.groups.map((g, i) => {
              const mine = g.sender_id === me;
              return (
                <div
                  key={i}
                  className={`mt-2 space-y-1 ${mine ? "text-right" : "text-left"}`}
                >
                  {!mine && (
                    <div className="ml-9 mb-1 text-[11px] text-gray-600">
                      {g.name || "User"}
                    </div>
                  )}
                  {g.items.map((m) => (
                    <Bubble
                      key={m.id}
                      mine={mine}
                      msg={m}
                      name={g.name}
                      avatarUrl={g.avatar_url}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={sendMessage}
        className="p-3 border-t border-veryLightGray flex gap-2 bg-white fixed bottom-0 w-full"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 border border-veryLightGray rounded-xl px-3 py-2"
        />
        <button className="px-4 py-2 rounded-xl bg-black text-white">
          Send
        </button>
      </form>
    </div>
  );
}
