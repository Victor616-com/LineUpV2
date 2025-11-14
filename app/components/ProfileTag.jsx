import React from "react";

const ProfileTag = ({ children }) => {
  return (
    <div className="px-[15px] py-[5px] rounded-[20px] w-fit bg-profileColor1 text-m text-white ">
      {children}
    </div>
  );
};

export default ProfileTag;
