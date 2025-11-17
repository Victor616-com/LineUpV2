import React from "react";

export default function CollabCard({ item }) {
  return (
    <div className="p-s rounded-[18px] bg-white/5 backdrop-blur-md border border-white/10 flex flex-col gap-s">
      
      {/* Title */}
      <h3 className="text-white text-l font-semibold">{item.title}</h3>

      {/* Description */}
      {item.description && (
        <p className="text-white/70 text-m">{item.description}</p>
      )}

      {/* Genres */}
      {item.genres?.length > 0 && (
        <div className="flex flex-wrap gap-xxs">
          {item.genres.map((genre) => (
            <span
              key={genre}
              className="px-2 py-[2px] rounded-full bg-white/10 text-white/80 text-xs"
            >
              {genre}
            </span>
          ))}
        </div>
      )}

      {/* Media */}
      {item.media_url && (
        <img
          src={item.media_url}
          alt="collab media"
          className="rounded-lg object-cover max-h-60"
        />
      )}

      {/* Location */}
      {item.location && (
        <p className="text-white/60 text-sm">
          {item.location === "Remote" ? "Remote" : `Location: ${item.location}`}
        </p>
      )}

      {/* Paid */}
      {item.paid_opportunity !== null && (
        <p className="text-white/50 text-sm">
          {item.paid_opportunity ? "Paid opportunity" : "Unpaid"}
        </p>
      )}

      {/* Timestamp */}
      <p className="text-xs text-white/40">
        Posted: {new Date(item.created_at).toLocaleString()}
      </p>
    </div>
  );
}

