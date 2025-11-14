import React from "react";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

import backIcon from "../../../assets/images/back-icon.svg";
import closeIcon from "../../../assets/images/x-icon.svg";
import lineProIcon from "../../../assets/images/linePro-icon.svg";
import saveIcon from "../../../assets/images/save-icon.svg";
import insightsIcon from "../../../assets/images/insights-icon.svg";
import inviteFriendsIcon from "../../../assets/images/inviteFriends-icon.svg";
import rateIcon from "../../../assets/images/star-icon.svg";
import settingsIcon from "../../../assets/images/settings-icon.svg";
import help from "../../../assets/images/help-icon.svg";
import logOutIcon from "../../../assets/images/log-out-icon.svg";

function TopBarMenu({ menuOpen, setMenuOpen }) {
  const { signOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div
      className={`fixed top-0 right-0 h-full w-full bg-white shadow-xl z-[100] px-s transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Close button */}
      <div className="flex justify-center items-center w-full h-[60px] relative">
        <img
          src={closeIcon}
          alt="close-menu"
          className="h-[11px] w-auto absolute left-0 cursor-pointer"
          onClick={() => setMenuOpen(false)}
        />
        <p className="text-m">Menu</p>
      </div>

      {/* Menu links */}
      <div className="flex flex-col gap-l mt-[15px]">
        {[
          { icon: lineProIcon, label: "Get Pro lineUp" },
          { icon: saveIcon, label: "Save" },
          { icon: insightsIcon, label: "Insights" },
          { icon: inviteFriendsIcon, label: "Invite Friends" },
          { icon: rateIcon, label: "Rate the app" },
          { icon: settingsIcon, label: "Settings" },
          { icon: help, label: "Help" },
        ].map((item) => (
          <div key={item.label} className="flex flex-row justify-between">
            <div className="flex flex-row items-center gap-xs">
              <img src={item.icon} alt={item.label} />
              <p className="text-m">{item.label}</p>
            </div>
            <img src={backIcon} alt="follow link" className="rotate-180" />
          </div>
        ))}

        {/* Log out */}
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-xs">
            <img src={logOutIcon} alt="log out" />
            <p onClick={handleSignOut} className="text-m cursor-pointer">
              Log out
            </p>
          </div>
          <img src={backIcon} alt="follow link" className="rotate-180" />
        </div>
      </div>
    </div>
  );
}

export default TopBarMenu;
