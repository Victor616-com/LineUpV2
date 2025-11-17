import React from "react";
import profilePic from "../../assets/images/profile-placeholder.png";
import { useNavigate } from "react-router";
import NoteBottomBar from "./NoteBottomBar";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
const deleteIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
      fill="white"
    />
  </svg>
);
const hideIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M10.0007 11.6668C10.9211 11.6668 11.6673 10.9206 11.6673 10.0002C11.6673 9.07969 10.9211 8.3335 10.0007 8.3335C9.08018 8.3335 8.33398 9.07969 8.33398 10.0002C8.33398 10.9206 9.08018 11.6668 10.0007 11.6668Z"
      stroke="white"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M17.5 10C15.9262 12.4925 13.0986 15 10 15C6.90141 15 4.0738 12.4925 2.5 10C4.41546 7.63187 6.65969 5 10 5C13.3403 5 15.5846 7.63183 17.5 10Z"
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
const saveIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="17"
    viewBox="0 0 13 17"
    fill="none"
  >
    <path
      d="M0.625 15.625V2.29167C0.625 1.37119 1.37119 0.625 2.29167 0.625H10.625C11.5455 0.625 12.2917 1.37119 12.2917 2.29167V15.625L7.3596 12.4544C6.81058 12.1014 6.10608 12.1014 5.55707 12.4544L0.625 15.625Z"
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
const menu = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle cx="18" cy="12" r="1" fill="#1E1E1E" />
    <circle cx="12" cy="12" r="1" fill="#1E1E1E" />
    <circle cx="6" cy="12" r="1" fill="#1E1E1E" />
  </svg>
);

function Note({ note }) {
  const { session } = UserAuth();
  const userId = session?.user?.id;
  const navigate = useNavigate();
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    await supabase.from("notes").delete().eq("id", note.id);
    window.location.reload(); // Or use state instead of reload later
  };

  const noteBottomBarRef = React.useRef();
  // Mavigate to the user's profile page
  const goToProfile = () => {
    navigate(`/profile/${note.user_id}`);
  };
  const handleDoubleTap = () => {
    if (noteBottomBarRef.current) {
      noteBottomBarRef.current.toggleLike();
    }
  };
  return (
    <div className="flex flex-col gap-s  py-xs">
      <div className="flex flex-row justify-between items-center px-xs">
        <div className="flex flex-row gap-xs">
          <div
            className="flex flex-row gap-xxs items-center"
            onClick={goToProfile}
          >
            <img
              className="w-8 h-8 rounded-full object-cover ring-1 ring-white"
              src={
                note.avatar_url
                  ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_images/${note.avatar_url}`
                  : profilePic
              }
              alt="profile-image"
            />
            <p className="text-s">{note.name || "Profile Name"}</p>
          </div>
          <div className="flex flex-row gap-xxs items-center">
            {note.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs text-[#55555] px-xxs py-xxxs rounded-full border border-[#55555]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div onClick={toggleMenu} className="cursor-pointer">
          {menu}
        </div>
        {isMenuOpen && userId === note.user_id && (
          <div
            ref={menuRef}
            className="absolute right-4 mt-30 bg-[#767676] border border-[#bababa] rounded-small px-s py-xxs z-50"
          >
            <button
              onClick={handleDelete}
              className="text-white w-full text-s flex flex-row items-center gap-xs border-b border-[#c8c8c8] py-xxs"
            >
              <div className="w-5 flex items-center justify-center">
                {deleteIcon}
              </div>
              Delete note
            </button>
            <button className="text-white w-full text-s flex flex-row items-center gap-xs 8] py-xxs">
              <div className="w-5 flex items-center justify-center">
                {shareIcon}
              </div>
              Share note
            </button>
          </div>
        )}
        {isMenuOpen && userId !== note.user_id && (
          <div
            ref={menuRef}
            className="absolute right-4 mt-50 bg-[#767676] border border-[#bababa] rounded-small px-s py-xxs z-50"
          >
            <button className="text-white w-full text-s flex flex-row items-center gap-xs border-b border-[#c8c8c8] py-xxs">
              <div className="w-5 flex items-center justify-center">
                {saveIcon}
              </div>
              Save note
            </button>
            <button className="text-white w-full text-s flex flex-row items-center gap-xs  py-xxs border-b border-[#c8c8c8]">
              <div className="w-5 flex items-center justify-center">
                {shareIcon}
              </div>
              Share note
            </button>
            <button className="text-white w-full text-s flex flex-row items-center gap-xs  py-xxs border-b border-[#c8c8c8]">
              <div className="w-5 flex items-center justify-center">
                {hideIcon}
              </div>
              Hide notes from this user
            </button>
            <button className="text-white w-full text-s flex flex-row items-center gap-xs  py-xxs ">
              <div className="w-5 flex items-center justify-center">
                {reportIcon}
              </div>
              Report note
            </button>
          </div>
        )}
      </div>

      <h2 className="text-heading3 px-xs">{note.title}</h2>

      {note.media_url && (
        <img
          src={note.media_url}
          alt="note media"
          className="w-full h-auto rounded-small"
          onDoubleClick={handleDoubleTap}
        />
      )}

      <p className="text-m wrap-break-word w-full px-xs">{note.description}</p>
      <NoteBottomBar ref={noteBottomBarRef} noteId={note.id} />
    </div>
  );
}

export default Note;
