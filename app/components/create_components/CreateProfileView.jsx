import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import profilePic from "../../../assets/images/profile-placeholder.png";
function CreateProfileView() {
  const [profile, setProfile] = useState(null);
  const { session } = UserAuth(); // current session
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return; // guard

      const { data, error } = await supabase
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", session.user.id)
        .single();

      if (error) console.error("Error loading profile:", error);
      else setProfile(data);
    };

    fetchProfile();
  }, [session]);
  return (
    <div className="flex flex-row gap-xs items-center w-full px-s">
      <img
        className="w-10 h-10 rounded-full object-cover ring-1 ring-white"
        src={
          profile?.avatar_url
            ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${profile.avatar_url}`
            : profilePic
        }
        alt="profile"
      />
      <p className="text-m">{profile?.name || "Profile Name"}</p>
    </div>
  );
}

export default CreateProfileView;
