import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";

import CollabRequestPreviewCard from "./CollabRequestPreviewCard";
import YellowBtn from "./YellowBtn";

const plusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M8 12H12M16 12H12M12 12V8M12 12V16"
      stroke="#1D1D1D"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="#1D1D1D"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

function CollabRequestPreview() {
  const navigate = useNavigate();
  const { session } = UserAuth();
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("collab_requests ")
        .select(
          `
            id,
            title,
            description,
            created_at,
            user_id,
            location,
            looking_for,
            profiles!inner(name, avatar_url)
          `,
        )
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) {
        console.error("Error fetching requests:", error);
        return;
      }

      const formatted = data.map((request) => ({
        id: request.id,
        title: request.title,
        description: request.description,
        created_at: request.created_at,
        user_id: request.user_id,
        location: request.location,
        looking_for: request.looking_for,
        name: request.profiles?.name,
        avatar_url: request.profiles?.avatar_url,
      }));

      setRequests(formatted);

      const userRequests = formatted.filter(
        (request) => request.user_id === session?.user?.id,
      );
    };
    fetchRequests();
  }, [session]);

  const handleCreateClick = () => {
    navigate("/create", { state: { selected: "request" } });
  };
  return (
    <div className="bg-[#F7F6F6] py-s flex flex-col gap-s">
      <p className="text-m text-center">Collaboration requests for you</p>
      <div className="px-s w-full overflow-x-auto no-scrollbar">
        <div className="flex flex-row flex-nowrap w-fit gap-3 py-1">
          {requests.map((request) => (
            <div key={request.id}>
              <CollabRequestPreviewCard request={request} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-between px-s">
        <button
          className="border border-yellow px-[10px] rounded-full text-m"
          onClick={() => navigate("/collabs")}
        >
          See more
        </button>
        <YellowBtn className="text-m text-black" onClick={handleCreateClick}>
          {plusIcon}Create your own
        </YellowBtn>
      </div>
    </div>
  );
}

export default CollabRequestPreview;
