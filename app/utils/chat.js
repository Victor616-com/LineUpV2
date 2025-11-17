// --- Time and date formatting utilities ---

// function to format time like "02:30 PM"
export function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// function to format a date like "Mon, Jan 1, 2024"
export function fmtDay(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

//function to check if two dates are the same day
export function sameDay(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

// --- Profile utilities ---

//function to get initials from a name
export function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// function to get public avatar url from supabase storage
export function toPublicAvatar(urlPath) {
  if (!urlPath) return null;

  // Encode each path segment so spaces don't break the URL
  const encoded = urlPath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${encoded}`;
}

// ---- Validation ----

// UUID regex which is used to validate UUIDs. UUIS are needed to identify messages and chats.
export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
