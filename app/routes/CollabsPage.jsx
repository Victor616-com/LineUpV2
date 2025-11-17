import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import CollabCard from "../../components/CollabCard";

export default function CollabsPage() {
  // 1. State to store fetched collabs
  const [collabs, setCollabs] = useState([]);

  // 2. Fetch existing collabs when the page loads
  useEffect(() => {
    const fetchCollabs = async () => {
      const { data, error } = await supabase
        .from("collab_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching collabs:", error);
      } else {
        setCollabs(data);
      }
    };

    fetchCollabs();
  }, []);

  // 3. Render the UI
  return (
    <div className="px-s py-m">
      <h1 className="text-white text-xl mb-m">Collaborations</h1>

      <div className="flex flex-col gap-m">
        {collabs.map((item) => (
          <CollabCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
