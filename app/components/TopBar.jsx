import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import logo from "../../assets/images/logo.svg";
import backIcon from "../../assets/images/back-icon.svg";
import searchIcon from "../../assets/images/search-icon.svg";
import menuIcon from "../../assets/images/menu-icon.svg";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../context/AuthContext";

import TopBarMenu from "./top_bar_components/TopBarMenu";
import Notifications from "./top_bar_components/Notifications";

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isHome = location.pathname === "/home";
  const { session } = UserAuth();
  const userId = session?.user?.id;
  const [hasNotification, setHasNotification] = useState(false);

  const notificationIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M15.1113 9.16699C15.5963 13.6466 17.5 15.0003 17.5 15.0003H2.5C2.5 15.0003 5 13.2225 5 7.00033C5 5.58584 5.52678 4.22928 6.46447 3.22909C7.40215 2.2289 8.67392 1.66699 10 1.66699C10.2811 1.66699 10.5598 1.69224 10.8333 1.74156"
        stroke="#1E1E1E"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.5 2.99512C16.4665 2.99512 17.25 3.77862 17.25 4.74512C17.25 5.71162 16.4665 6.49512 15.5 6.49512C14.5335 6.49512 13.75 5.71162 13.75 4.74512C13.75 3.77862 14.5335 2.99512 15.5 2.99512Z"
        stroke={hasNotification ? "#FFCF70" : "#1E1E1E"}
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.4419 17.5C11.2954 17.7526 11.0851 17.9622 10.8321 18.1079C10.5791 18.2537 10.2922 18.3304 10.0003 18.3304C9.70828 18.3304 9.42142 18.2537 9.1684 18.1079C8.91539 17.9622 8.7051 17.7526 8.55859 17.5"
        stroke="#1E1E1E"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );

  useEffect(() => {
    if (!userId) return;

    // Fetch pending requests on load
    const fetchUnread = async () => {
      const { data, error } = await supabase
        .from("connections")
        .select("id")
        .eq("to_user", userId)
        .eq("status", "pending");

      if (!error) setHasNotification(data.length > 0);
    };

    fetchUnread();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("connection-requests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "connections" },
        (payload) => {
          const row = payload.new;
          if (row.to_user === userId && row.status === "pending") {
            setHasNotification(true);
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "connections" },
        (payload) => {
          const row = payload.new;
          // If a request for this user was accepted or rejected, check remaining pending
          if (row.to_user === userId) fetchUnread();
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "connections" },
        () => {
          fetchUnread(); // check remaining pending
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  return (
    <>
      {/* Top Bar */}
      <div className="flex flex-row justify-between bg-white px-s fixed top-0 left-0 w-full h-[60px] items-center z-50">
        {isHome ? (
          <img
            src={logo}
            alt="logo"
            className="h-[25px] w-auto cursor-default"
          />
        ) : (
          <img
            src={backIcon}
            alt="back"
            className="h-[25px] w-auto cursor-pointer"
            onClick={() => navigate(-1)}
          />
        )}

        <div className="flex flex-row gap-s">
          {/* Search */}
          <img
            src={searchIcon}
            alt="search"
            className="h-[20px] w-auto cursor-pointer"
          />

          {/* Notification */}
          <div
            onClick={() => {
              setNotificationsOpen(true);
              setHasNotification(false); // Clear indicator when user opens panel
            }}
          >
            {notificationIcon}
          </div>

          {/* Menu */}
          <img
            src={menuIcon}
            alt="menu"
            className="h-[20px] w-auto cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        </div>
      </div>

      {/* Sliding Menu */}
      <TopBarMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Notifications
        notificationsOpen={notificationsOpen}
        setNotificationsOpen={setNotificationsOpen}
      />
    </>
  );
}

export default TopBar;
