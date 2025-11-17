import React from "react";
import imgPlaceholder from "../../assets/images/profile-placeholder.png";
function CollabRequestPreviewCard() {
  return (
    <div className="w-[340px] flex flex-col items-center bg-white p-s rounded-small gap-xs">
      <div className="flex flex-row w-full gap-xxs items-center">
        <img
          className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
          src={imgPlaceholder}
          alt="profile-image"
        />
        <div className="flex flex-row gap-1">
          <p className="text-xs">Profile Name</p>
          <p className="text-xs">looking for a</p>
          <p className="text-xs">#guitarist</p>
        </div>
      </div>
      <div className="w-[80%] h-px bg-[#dadada]"></div>
      <p className="text-m w-full text-black font-bold">
        Need a guitarist for my next concert
      </p>
      <p className="text-m w-full">
        I need someone who can learn a few song very fast. There is not much
        time left. We play mostly heavy stuff so it would be amazing if you have
        a 7 string.
      </p>
      <div className="flex justify-between w-full">
        <p className="text-s font-bold">Read more</p>
        <p className="text-s text-[#B4B2B2]">Aarhus - 9h ago</p>
      </div>
    </div>
  );
}

export default CollabRequestPreviewCard;
