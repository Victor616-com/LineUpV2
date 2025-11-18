import imgPlaceholder from "../../assets/images/profile-placeholder.png";
import { useNavigate } from "react-router";

// simple "x time ago" helper
function timeAgo(dateString) {
  if (!dateString) return "";
  const diff = Date.now() - new Date(`${dateString}Z`).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function CollabRequestPreviewCard({ request }) {
  const navigate = useNavigate();

  const timeAgoText = timeAgo(request.created_at);

  const primaryLookingFor =
    Array.isArray(request.looking_for) && request.looking_for.length > 0
      ? request.looking_for[0]
      : "musician";

  return (
    <div className="w-[340px] h-[235px] flex flex-col items-center bg-white p-s rounded-small gap-xs">
      <div className="flex flex-row w-full gap-xxs items-center">
        <img
          className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
          src={
            request.avatar_url
              ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${request.avatar_url}`
              : imgPlaceholder
          }
          alt="profile-image"
        />
        <div className="flex flex-row gap-1">
          <p className="text-xs">{request.name}</p>
          <p className="text-xs">looking for a</p>
          <p className="text-xs">#{primaryLookingFor}</p>
        </div>
      </div>
      <div className="w-[80%] h-px bg-[#dadada]"></div>
      <p className="text-m w-full text-black font-bold">{request.title}</p>
      <p className="text-m w-full h-full">{request.description}</p>
      <div className="flex justify-between w-full">
        <p className="text-s font-bold" onClick={() => navigate("/collabs")}>
          Read more
        </p>
        <p className="text-s text-[#B4B2B2]">
          {request.location || "No location"} · {timeAgoText}
        </p>
      </div>
    </div>
  );
}

export default CollabRequestPreviewCard;
