import React, { useEffect, useState } from "react";
import closeIcon from "../../../assets/images/x-icon.svg";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";

function Notifications({ notificationsOpen, setNotificationsOpen }) {
  const { session } = UserAuth();
  const userId = session?.user?.id;
  const [requests, setRequests] = useState([]);

  // Fetch pending connection requests
  useEffect(() => {
    if (!notificationsOpen || !userId) return;

    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("connections")
        .select(`id, from_user, status, profiles:from_user (name, avatar_url)`)
        .eq("to_user", userId)
        .eq("status", "pending");

      if (!error) setRequests(data);
    };

    fetchRequests();
  }, [notificationsOpen, userId]);

  const handleAccept = async (connectionId) => {
    await supabase
      .from("connections")
      .update({ status: "accepted" })
      .eq("id", connectionId);

    // Remove it from local state
    setRequests((prev) => prev.filter((r) => r.id !== connectionId));
  };

  return (
    <div
      className={`flex flex-col gap-m fixed top-0 right-0 h-full w-full bg-white shadow-xl z-[100] px-s transform transition-transform duration-300
        ${notificationsOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Close button */}
      <div className="flex justify-center items-center w-full h-[60px] relative">
        <img
          src={closeIcon}
          alt="close"
          className="h-[11px] w-auto absolute left-0 cursor-pointer"
          onClick={() => setNotificationsOpen(false)}
        />
        <p className="text-m">Notifications</p>
      </div>

      <div className="flex flex-col gap-s">
        {/* Connection requests */}
        <div className="flex flex-col gap-s">
          <p className="text-s text-[#878787] mb-m">Connection Requests</p>
          {requests.length === 0 && (
            <p className="text-s text-gray-400">No new requests</p>
          )}

          {requests.map((request) => (
            <div
              key={request.id}
              className="flex flex-row justify-between items-center"
            >
              <div className="flex flex-row gap-xxs items-center">
                <img
                  src={
                    request.profiles.avatar_url
                      ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${request.profiles.avatar_url}`
                      : "/assets/images/profile-placeholder.png"
                  }
                  alt=""
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-white"
                />
                <p className="text-s">
                  <span className="font-semibold">{request.profiles.name}</span>{" "}
                  wants to connect
                </p>
              </div>

              <button
                onClick={() => handleAccept(request.id)}
                className="text-s px-xs py-xxs rounded-full bg-yellow"
              >
                Accept
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-s">
          <p className="text-s text-[#878787] mb-m">Collaboration Requests</p>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
