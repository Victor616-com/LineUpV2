import { UserAuth } from "../context/AuthContext";
const ProfileTag = ({ children }) => {
  const { themeColor } = UserAuth();
  return (
    <div
      className="px-[15px] py-[5px] rounded-[20px] w-fit text-m text-white "
      style={{ backgroundColor: themeColor }}
    >
      {children}
    </div>
  );
};

export default ProfileTag;
