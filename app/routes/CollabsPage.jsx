import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import CollabCard from "../components/CollabCard";

export default function CollabsPage() {
  // 1. State to store fetched collabs
  const [collabs, setCollabs] = useState([]);

  useEffect(() => {
  const load = async () => {
    // 1. Fetch collabs
    const { data: collabs, error } = await supabase
      .from("collab_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Collab fetch error:", error);
      return;
    }

    // 2. Extract all user IDs
    const userIds = collabs.map(c => c.user_id);

    // 3. Fetch profiles for these user IDs
    const { data: profiles, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);

    if (profileErr) {
      console.error("Profile fetch error:", profileErr);
      return;
    }

    // Turn list into a map
    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.id] = p;
    });

    // 4. Merge the profile with each collab
    const merged = collabs.map(c => ({
      ...c,
      user: profileMap[c.user_id] || null,
    }));

    setCollabs(merged);
  };

  load();
}, []);


  // 3. Render the UI
  return (
    <div className="px-s py-m bg-[#F6F6F6]">
    <div className="flex flex-col gap-m">
  {collabs.map((item) => (
    <div key={item.id} className="w-full">
      <CollabCard key={item.id} item={item} user={item.user} />
    </div>
  ))}
</div>

    </div>
  );
}
