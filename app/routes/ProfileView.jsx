import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import profileImg from "../../assets/images/profile-placeholder.png";
import ProfileAbout from "../components/ProfileAbout";
import menu from "../../assets/images/menu-dots.svg";
import { supabase } from "../supabaseClient";
import ProfileNotes from "../components/ProfileNotes";
import { UserAuth } from "../context/AuthContext";
import StartChatButton from "../components/chats_components/StartChatButton";
import TransparentBtn from "../components/TransparentBtn";
const savedIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M4.16602 17.5V4.16667C4.16602 3.24619 4.91221 2.5 5.83268 2.5H14.166C15.0865 2.5 15.8327 3.24619 15.8327 4.16667V17.5L10.9006 14.3294C10.3516 13.9764 9.6471 13.9764 9.09809 14.3294L4.16602 17.5Z"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const archivedIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M9.99935 10.0003C13.221 10.0003 15.8327 7.38865 15.8327 4.16699H4.16602C4.16602 7.38865 6.77769 10.0003 9.99935 10.0003ZM9.99935 10.0003C13.221 10.0003 15.8327 12.612 15.8327 15.8337H4.16602C4.16602 12.612 6.77769 10.0003 9.99935 10.0003Z"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4.16602 1.66699H9.99935H15.8327"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4.16602 18.333H9.99935H15.8327"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
const shareIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M16.6673 10.8335V15.8335C16.6673 16.754 15.9211 17.5002 15.0007 17.5002H5.00065C4.08018 17.5002 3.33398 16.754 3.33398 15.8335V10.8335"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.99935 12.5V2.5M9.99935 2.5L7.08268 5.41667M9.99935 2.5L12.916 5.41667"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
const disconnectIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M13.1161 10.3485L15.2322 8.23242M17.3483 6.11633L15.2322 8.23242M15.2322 8.23242L13.1161 6.11633M15.2322 8.23242L17.3483 10.3485"
      stroke="white"
      stroke-width="1.4963"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M0.833984 16.6667V15.8333C0.833984 12.6117 3.44566 10 6.66732 10C9.88898 10 12.5007 12.6117 12.5007 15.8333V16.6667"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.66732 10.0002C8.50827 10.0002 10.0007 8.50778 10.0007 6.66683C10.0007 4.82588 8.50827 3.3335 6.66732 3.3335C4.82637 3.3335 3.33398 4.82588 3.33398 6.66683C3.33398 8.50778 4.82637 10.0002 6.66732 10.0002Z"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
const blockIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M7.64413 12.357L10.0012 10M12.3582 7.64298L10.0012 10M10.0012 10L7.64413 7.64298M10.0012 10L12.3582 12.357"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.99935 18.3332C14.6017 18.3332 18.3327 14.6022 18.3327 9.99984C18.3327 5.39746 14.6017 1.6665 9.99935 1.6665C5.39698 1.6665 1.66602 5.39746 1.66602 9.99984C1.66602 14.6022 5.39698 18.3332 9.99935 18.3332Z"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
const reportIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M10 6.6665L10 9.99984"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M10 13.3418L10.0083 13.3326"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.99935 18.3332C14.6017 18.3332 18.3327 14.6022 18.3327 9.99984C18.3327 5.39746 14.6017 1.6665 9.99935 1.6665C5.39698 1.6665 1.66602 5.39746 1.66602 9.99984C1.66602 11.5177 2.07183 12.9408 2.78087 14.1665L2.08268 17.9165L5.83268 17.2183C7.0584 17.9274 8.48149 18.3332 9.99935 18.3332Z"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
const plusIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M5.33398 7.99967H8.00065M10.6673 7.99967H8.00065M8.00065 7.99967V5.33301M8.00065 7.99967V10.6663"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8.00065 14.6663C11.6825 14.6663 14.6673 11.6816 14.6673 7.99967C14.6673 4.31778 11.6825 1.33301 8.00065 1.33301C4.31875 1.33301 1.33398 4.31778 1.33398 7.99967C1.33398 11.6816 4.31875 14.6663 8.00065 14.6663Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
const ProfileView = () => {
  const { session } = UserAuth();
  const { id } = useParams(); // ✅ The profile user ID from URL
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const [notesCount, setNoteCount] = useState(0);

  // ✅ Fetch profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, avatar_url, bio, about_me, looking_for, genres ")
        .eq("id", id)
        .single();

      if (error) console.error("Error loading profile:", error);
      else setProfile(data);
    };

    fetchProfile();
  }, [id]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data?.user?.id || null);
    };
    getUser();
  }, []);

  // Connections
  const handleConnect = async () => {
    if (!session?.user) return alert("You must be logged in to connect.");

    const fromUser = session.user.id; // current user
    const toUser = id; // the profile being viewed

    if (fromUser === toUser) return alert("You cannot connect to yourself.");

    // Check if a connection already exists
    const { data: existing } = await supabase
      .from("connections")
      .select("id, status")
      .eq("from_user", fromUser)
      .eq("to_user", toUser)
      .single();

    if (existing) {
      if (existing.status === "pending") return alert("Request already sent.");
      if (existing.status === "accepted")
        return alert("You are already connected.");
    }

    // Insert connection request
    const { error } = await supabase.from("connections").insert([
      {
        from_user: fromUser,
        to_user: toUser,
        status: "pending",
      },
    ]);

    if (error) console.error(error);
    else setConnectionStatus("pending");
  };

  //Connection status
  useEffect(() => {
    const fetchConnectionStatus = async () => {
      if (!currentUserId || currentUserId === id) return;

      const { data, error } = await supabase
        .from("connections")
        .select("status")
        .or(
          `and(from_user.eq.${currentUserId},to_user.eq.${id}),and(from_user.eq.${id},to_user.eq.${currentUserId})`,
        );

      if (error) {
        console.error("Error fetching connection status:", error);
        return;
      }

      // There may be 0, 1 or 2 matching rows → pick the most relevant
      if (data && data.length > 0) {
        // If any row is accepted → they are connected
        if (data.some((row) => row.status === "accepted")) {
          setConnectionStatus("accepted");
        } else {
          // Otherwise it's pending
          setConnectionStatus("pending");
        }
      } else {
        setConnectionStatus(null);
      }
    };

    fetchConnectionStatus();
  }, [currentUserId, id]);

  //gets the number of connections a user has and the number of notes he made
  useEffect(() => {
    const fetchCounts = async () => {
      // Count accepted connections
      const { count: connectionsCount, error: connectionError } = await supabase
        .from("connections")
        .select("id", { count: "exact", head: true })
        .or(`from_user.eq.${id},to_user.eq.${id}`)
        .eq("status", "accepted");

      if (!connectionError) setConnectionCount(connectionsCount || 0);

      // Count notes made by this user
      const { count: notesCount, error: notesError } = await supabase
        .from("notes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", id);

      if (!notesError) setNoteCount(notesCount || 0);
    };

    fetchCounts();
  }, [id]);

  const handleDisconnect = async () => {
    if (!currentUserId || !id) return;

    // Delete connection between the two users, in either direction
    const { error } = await supabase
      .from("connections")
      .delete()
      .or(
        `and(from_user.eq.${currentUserId},to_user.eq.${id}),and(from_user.eq.${id},to_user.eq.${currentUserId})`,
      );

    if (error) {
      console.error("Error disconnecting:", error);
      return;
    }

    // Update UI
    setConnectionStatus(null);
  };

  if (!profile)
    return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="pb-[110px]">
      <div className="relative flex flex-col items-center justify-center gap-s mt-[10px] bg-profileColor1 py-m rounded-medium mx-[10px]">
        {/* Menu Button */}
        <img
          onClick={() => setShowMenu((prev) => !prev)}
          className="absolute right-[30px] top-[30px] scale-[1.2] cursor-pointer"
          src={menu}
          alt="menu"
        />

        {/* Dropdown Menu */}
        {showMenu &&
          (currentUserId === id ? (
            <>
              <div
                ref={menuRef}
                className="absolute right-5 top-[50px] z-50 bg-[#767676] border border-[#bababa] rounded-small px-s py-xs"
              >
                <button className="text-white w-full text-s flex flex-row justify-start items-center gap-xs border-b border-[#c8c8c8] py-xs">
                  {savedIcon}
                  Saved
                </button>
                <button className="text-white  text-s flex flex-row justify-start items-center gap-xs py-xs w-full">
                  {archivedIcon}
                  Archived
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                ref={menuRef}
                className="absolute right-5 top-[50px] z-50 bg-[#767676] border border-[#bababa] rounded-small px-s py-xs"
              >
                <button className="text-white w-full text-s flex flex-row justify-start items-center gap-xs border-b border-[#c8c8c8] py-xs">
                  {shareIcon}
                  Share profile
                </button>
                {connectionStatus === "accepted" && (
                  <button
                    onClick={handleDisconnect}
                    className="text-white w-full text-s flex flex-row justify-start items-center gap-xs border-b border-[#c8c8c8] py-xs"
                  >
                    {disconnectIcon}
                    Disconnect
                  </button>
                )}

                <button className="text-white w-full text-s flex flex-row justify-start items-center gap-xs border-b border-[#c8c8c8] py-xs">
                  {blockIcon}
                  Block user
                </button>

                <button className="text-white  text-s flex flex-row justify-start items-center gap-xs py-xs w-full">
                  {reportIcon}
                  Report user
                </button>
              </div>
            </>
          ))}

        {/* Profile Header Content */}
        <div className="flex flex-row items-center justify-between w-full">
          {/* Connections */}
          <div className="flex-1 flex flex-col items-center text-center text-white">
            <p className="text-m text-white">{connectionCount}</p>
            <p className="text-xs text-lightGray">Connections</p>
          </div>
          {/* Profile Image */}
          <img
            className="w-[150px] h-[150px] rounded-full object-cover ring-1 ring-white"
            src={
              profile?.avatar_url
                ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${profile.avatar_url}`
                : profileImg
            }
            alt="profile"
          />
          {/* Notes */}
          <div className="flex-1 flex flex-col items-center text-center text-white">
            <p className="text-m text-white">{notesCount}</p>
            <p className="text-xs text-lightGray">Notes</p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <p className="text-l text-white">{profile.name} </p>
          <p className="text-s text-lightGray">{profile.bio}</p>
        </div>

        <div className="flex justify-space-between gap-s">
          {currentUserId === id ? (
            <>
              <Link to={`/profile/${id}/edit`}>
                <TransparentBtn>Edit Profile</TransparentBtn>
              </Link>

              <TransparentBtn>Share Profile</TransparentBtn>
            </>
          ) : (
            <>
              <TransparentBtn
                onClick={handleConnect}
                disabled={
                  connectionStatus === "pending" ||
                  connectionStatus === "accepted"
                }
              >
                {connectionStatus === "accepted"
                  ? "Connected"
                  : connectionStatus === "pending"
                    ? "Pending"
                    : "Connect"}
                {connectionStatus !== "accepted" && plusIcon}
              </TransparentBtn>

              <StartChatButton targetUserId={id} />
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-row justify-around items-center mt-[20px]">
        <button
          onClick={() => setActiveTab("about")}
          className={`w-full h-[50px] rounded-tl-medium bg-white text-m transition-all duration-200 ${
            activeTab === "about" ? "text-black" : "text-gray-500"
          }`}
        >
          About
        </button>
        <div className="w-[1px] bg-lightGray h-[20px] absolute"></div>
        <button
          onClick={() => setActiveTab("notes")}
          className={`w-full h-[50px] rounded-tr-medium bg-white transition-all duration-200 ${
            activeTab === "notes" ? " text-black" : "text-gray-500"
          }`}
        >
          Notes
        </button>
      </div>

      {/* Tab Content */}
      <div className=" py-s bg-white">
        {activeTab === "about" ? (
          <ProfileAbout profile={profile} />
        ) : (
          <ProfileNotes userId={id} />
        )}
      </div>
    </div>
  );
};

export default ProfileView;
