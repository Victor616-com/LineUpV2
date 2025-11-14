import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import ChatsBox from "../components/chats_components/ChatsBox";

const searchIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M17 17L21 21"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
const writeMessageIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M14.3632 5.65156L15.8431 4.17157C16.6242 3.39052 17.8905 3.39052 18.6716 4.17157L20.0858 5.58579C20.8668 6.36683 20.8668 7.63316 20.0858 8.41421L18.6058 9.8942M14.3632 5.65156L4.74749 15.2672C4.41542 15.5993 4.21079 16.0376 4.16947 16.5054L3.92738 19.2459C3.87261 19.8659 4.39148 20.3848 5.0115 20.33L7.75191 20.0879C8.21972 20.0466 8.65806 19.8419 8.99013 19.5099L18.6058 9.8942M14.3632 5.65156L18.6058 9.8942"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

function ChatsPage() {
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div className="w-full flex justify-center">
      <div className="w-full  pt-m bg-[#3F4D54]">
        <div className="flex px-s justify-between mb-10 items-center">
          {/* Title box */}
          <div className="text-heading1 text-white">Messages</div>
          <div className="flex flex-row gap-s">
            {searchIcon}
            {writeMessageIcon}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-row justify-around items-center">
          <button
            onClick={() => setActiveTab("chats")}
            className={`w-full h-[50px] rounded-tl-medium bg-white text-m transition-all duration-200 ${
              activeTab === "chats" ? "text-black" : "text-gray-500"
            }`}
          >
            Chats
          </button>
          <div className="w-[1px] bg-lightGray h-[20px] absolute"></div>
          <button
            onClick={() => setActiveTab("groups")}
            className={`w-full h-[50px] rounded-tr-medium bg-white transition-all duration-200 ${
              activeTab === "groups" ? " text-black" : "text-gray-500"
            }`}
          >
            Groups
          </button>
        </div>

        {/* Tab Content */}
        <div className="px-s py-s bg-white">
          {activeTab === "chats" ? (
            <ChatsBox />
          ) : (
            <p className="text-m">This is the Groups section content.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatsPage;
