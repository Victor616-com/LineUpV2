import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import imgPlaceholder from "../../assets/images/profile-placeholder.png";

function StoriesSection() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const getProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url");

      if (error) {
        console.error("Error fetching profiles", error);
        return;
      }

      setProfiles(data || []);
    };

    getProfiles();
  }, []);

  return (
    <div className="px-s w-full overflow-x-auto no-scrollbar">
      <div className="flex flex-row flex-nowrap w-fit gap-4 py-1">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex flex-col items-center w-fit gap-2 shrink-0"
          >
            <img
              src={
                profile.avatar_url
                  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${profile.avatar_url}`
                  : imgPlaceholder
              }
              alt="profile-image"
              className="w-[74px] h-[74px] rounded-full object-cover ring-2 ring-yellow"
            />
            <p className="text-xs w-[74px] max-w-[74px] text-center break-words leading-none">
              {profile.name || "Unnamed User"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoriesSection;
