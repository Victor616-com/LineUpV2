import React from "react";
import { Link } from "react-router";

// --- helpers ---
function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 60000;
  if (diff < 1) return "now";
  if (diff < 60) return `${Math.floor(diff)}m`;
  const h = diff / 60;
  if (h < 24) return `${Math.floor(h)}h`;
  const days = h / 24;
  if (days < 7) return `${Math.floor(days)}d`;
  return d.toLocaleDateString();
}

function previewText(text = "", limit = 50) {
  return text.length <= limit ? text : text.slice(0, limit - 1) + "…";
}

function lastMessage(thread) {
  const msgs = thread?.messages || [];
  if (!msgs.length) return null;
  return msgs.at(-1);
}

function initialsFor(text = "") {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Choose the best display identity for the row.
function pickPreviewIdentity(thread, usersMap, last) {
  const name =
    thread._dmName || // DM partner name (preferred for 1:1)
    thread._lastSenderName || // last sender name (fallback)
    (last?.senderId ? usersMap?.[last.senderId]?.name : "") ||
    thread.title ||
    "(Empty)";

  const avatar =
    thread._dmAvatar || // DM partner avatar
    thread._lastSenderAvatar || // last sender avatar
    null;

  return { name, avatar };
}

// Row
function ThreadItem({ thread, currentUserId, usersMap = {} }) {
  const last = lastMessage(thread);
  const { name: displayName, avatar } = pickPreviewIdentity(
    thread,
    usersMap,
    last,
  );
  const unread = Number.isFinite(thread._unread) ? thread._unread : 0;
  const isUnread = unread > 0 && last?.senderId !== currentUserId;

  return (
    <Link to={`/chats/${thread.id}`} className="block">
      <div className="w-full flex items-start gap-3 p-4 rounded-2xl border border-veryLightGray bg-white shadow-sm hover:shadow transition">
        {/* Avatar */}
        <div className="flex-none w-10 h-10">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-10 h-10 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gray-200 grid place-items-center text-sm font-semibold">
              {initialsFor(displayName)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <div
              className={`truncate ${isUnread ? "font-semibold" : "font-medium"}`}
            >
              {displayName}
            </div>
            <div className="ml-auto text-xs text-gray-500 whitespace-nowrap">
              {formatTime(last?.createdAt)}
            </div>
          </div>
          <div
            className={`text-sm truncate ${isUnread ? "font-semibold" : "text-gray-600"}`}
          >
            {previewText(last?.text || "Start the conversation", 50)}
          </div>
        </div>

        {/* Unread badge */}
        {unread > 0 && (
          <div className="flex-none text-xs px-2 py-1 rounded-full bg-black text-white self-start">
            {unread}
          </div>
        )}
      </div>
    </Link>
  );
}

// List
export function ChatsPreview({ threads = [], currentUserId, usersMap }) {
  const sorted = [...threads].sort(
    (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0),
  );

  return (
    <div className="w-full max-w-md mx-auto p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold">Chats</h2>
        <span className="text-xs text-gray-500">
          {sorted.length} thread{sorted.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="space-y-2">
        {sorted.map((t) => (
          <ThreadItem
            key={t.id}
            thread={t}
            currentUserId={currentUserId}
            usersMap={usersMap}
          />
        ))}
      </div>
    </div>
  );
}
