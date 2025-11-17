import React from "react";

// simple "x time ago" helper
function timeAgo(dateString) {
  if (!dateString) return "";
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CollabCard({ item, user }) {
  const timeAgoText = timeAgo(item.created_at);
  const avatarSrc = user?.avatar_url
  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${user.avatar_url}`
  : "/placeholder.png";
  const primaryGenre =
  Array.isArray(item.genres) && item.genres.length > 0
    ? item.genres[0]
    : "collab";

  const firstName = user?.name ? user.name.split(" ")[0] : "Unknown";

  const primaryLookingFor =
  Array.isArray(item.looking_for) && item.looking_for.length > 0
    ? item.looking_for[0]
    : "musician";




  return (
    <div className="bg-white rounded-[30px] p-4 shadow-sm border border-black/10 flex flex-col gap-4">
      {/* Top row: avatar + name + icon */}
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <img
            src={avatarSrc || "/default-avatar.png"}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
            />
            <p className="text-m text-black font-medium">
            {firstName} is looking for a #{primaryLookingFor}
            </p>
        </div>

        {/* top-right icon */}
        <button className="text-black/60">
            <img 
                src="assets/images/save-icon.svg"
                alt="save" 
                className="w-7 h-7 opacity-100"
            />
        </button>
        </div>


      {/* separator */}
      <div className="w-full h-px bg-black/10" />

      {/* title */}
      <h2 className="text-xl font-semibold text-black">{item.title}</h2>

      {/* tags left, location + time right */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {Array.isArray(item.genres) &&
            item.genres.map((tag) => (
              <span
                key={tag}
                className="px-xs py-xxs rounded-full border border-black/60 text-m text-black/60"
              >
                #{tag}
              </span>
            ))}
        </div>

        <p className="text-sm text-black/60 whitespace-nowrap">
          {item.location || "No location"} · {timeAgoText}
        </p>
      </div>

      {/* image */}
      {item.media_url && (
        <img
          src={item.media_url}
          alt=""
          className="w-full rounded-[30px] object-cover"
        />
      )}

      {/* description */}
      <p className="text-base text-black/80">{item.description}</p>

      {/* buttons row */}
      <div className="flex items-center justify-between pt-2">
        <button className="text-black font-medium text-base">
          Read more
        </button>

        <button className="flex items-center gap-2 bg-[#FFCF70] px-4 py-2.5 rounded-full text-black font-medium">
          <img 
                src="assets/images/chat-lines.svg"
                alt="save" 
                className="w-5 h-5 opacity-100"
            />
          Start a chat
        </button>
      </div>
    </div>
  );
}
