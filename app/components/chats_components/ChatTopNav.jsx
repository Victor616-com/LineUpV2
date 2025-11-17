// A top navigation bar component for chat interface.
import React, { useState } from "react";
import { useNavigate } from "react-router";
import backIcon from "../../../assets/images/back-icon-white.svg";
import menuIcon from "../../../assets/images/more-icon-white.svg";
import { UserAuth } from "../../context/AuthContext";

import TopBarMenu from "../top_bar_components/TopBarMenu";

function ChatTopNav({ title, avatarUrl }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Chats Top Bar */}
      <div className="fixed top-0 left-0 w-full h-[60px] bg-[#3F4D54] flex items-center justify-between px-4 z-50">
        {/* Back + Avatar + Name */}
        <div className="flex items-center gap-s min-w-0">
          <img
            src={backIcon}
            alt="back"
            className="h-[25px] w-auto cursor-pointer"
            onClick={() => navigate(-1)}
          />

          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={title}
              className="h-8 w-8 rounded-full object-cover"
            />
          )}

          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
      </div>
      {/* Menu Icon */}
      <div
        className="fixed top-4 right-4 h-[32px] w-[32px]  flex items-center justify-center cursor-pointer z-50"
        onClick={() => setMenuOpen(true)}
      >
        <img
          src={menuIcon}
          alt="menu"
          className="h-[20px] w-auto cursor-pointer"
          onClick={() => setMenuOpen(true)}
        />
      </div>

      {/* Sliding Menu */}
      <TopBarMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
}

export default ChatTopNav;
