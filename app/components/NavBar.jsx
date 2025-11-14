import React from "react";
import { NavLink } from "react-router";
import { UserAuth } from "../context/AuthContext";

const HomeIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M8.66667 22.5H6C3.79086 22.5 2 20.7091 2 18.5V10.8136C2 9.41493 2.73061 8.11781 3.92679 7.39285L9.92679 3.75649C11.2011 2.98421 12.7989 2.98421 14.0732 3.75649L20.0732 7.39285C21.2694 8.11781 22 9.41493 22 10.8136V18.5C22 20.7091 20.2091 22.5 18 22.5H15.3333M8.66667 22.5V18.0556C8.66667 16.2146 10.1591 14.7222 12 14.7222C13.8409 14.7222 15.3333 16.2146 15.3333 18.0556V22.5M8.66667 22.5H15.3333"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ServicesIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M14.834 21V15C14.834 13.8954 13.9386 13 12.834 13H10.834C9.72941 13 8.83398 13.8954 8.83398 15V21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="16"
    />
    <path
      d="M21.8183 9.36418L20.1243 3.43517C20.0507 3.17759 19.8153 3 19.5474 3H15.5L15.9753 8.70377C15.9909 8.89043 16.0923 9.05904 16.2532 9.15495C16.6425 9.38698 17.4052 9.81699 18 10C19.0158 10.3125 20.5008 10.1998 21.3465 10.0958C21.6982 10.0526 21.9157 9.7049 21.8183 9.36418Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M14 10C14.5675 9.82538 15.2879 9.42589 15.6909 9.18807C15.8828 9.07486 15.9884 8.86103 15.9699 8.63904L15.5 3H8.5L8.03008 8.63904C8.01158 8.86103 8.11723 9.07486 8.30906 9.18807C8.71207 9.42589 9.4325 9.82538 10 10C11.493 10.4594 12.507 10.4594 14 10Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M3.87567 3.43517L2.18166 9.36418C2.08431 9.7049 2.3018 10.0526 2.6535 10.0958C3.49916 10.1998 4.98424 10.3125 6 10C6.59477 9.81699 7.35751 9.38698 7.74678 9.15495C7.90767 9.05904 8.00913 8.89043 8.02469 8.70377L8.5 3H4.45258C4.18469 3 3.94926 3.17759 3.87567 3.43517Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const CreateIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M8 12H12M16 12H12M12 12V8M12 12V16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChatsIcon = ({ className }) => (
  <svg viewBox="0 0 26 27" className={className} fill="none" aria-hidden="true">
    <path
      d="M8 13L12 13L16 13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 17L10 17L12 17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 25C17.5228 25 22 20.5228 22 15C22 9.47715 17.5228 5 12 5C6.47715 5 2 9.47715 2 15C2 16.8214 2.48697 18.5291 3.33782 20L2.5 24.5L7 23.6622C8.47087 24.513 10.1786 25 12 25Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="20" cy="6" r="6" fill="#FFCF70" />
    <path
      d="M18.467 8.163H21.815V9H17.387L17.414 8.595C17.438 8.157 17.537 7.737 17.711 7.335C17.909 6.873 18.317 6.483 18.935 6.165L19.664 5.76C20.048 5.556 20.324 5.349 20.492 5.139C20.66 4.923 20.744 4.662 20.744 4.356C20.744 4.026 20.639 3.765 20.429 3.573C20.225 3.381 19.94 3.285 19.574 3.285C18.752 3.285 18.341 3.714 18.341 4.572H17.396C17.39 3.9 17.579 3.378 17.963 3.006C18.347 2.634 18.893 2.448 19.601 2.448C20.249 2.448 20.765 2.622 21.149 2.97C21.539 3.324 21.734 3.774 21.734 4.32C21.734 4.77 21.608 5.166 21.356 5.508C21.104 5.85 20.708 6.165 20.168 6.453L19.529 6.813C19.163 7.017 18.899 7.218 18.737 7.416C18.581 7.614 18.491 7.863 18.467 8.163Z"
      fill="black"
    />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M7 18V17C7 14.2386 9.23858 12 12 12C14.7614 12 17 14.2386 17 17V18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

function NavItem({ to, label, Icon }) {
  return (
    <NavLink to={to} end className="flex items-center justify-center ">
      {({ isActive }) => (
        <div
          className={[
            "w-16 h-16 rounded-full grid place-items-center mx-auto",
            isActive
              ? "text-[var(--color-yellow)] bg-white/10 backdrop-blur-md backdrop-saturate-150 ring-1 ring-white/20"
              : "text-white",
          ].join(" ")}
        >
          <div className="flex flex-col items-center justify-center gap-xxs">
            <Icon className="w-6 h-6" />
            <p
              className="text-xxs text-center leading-tight truncate max-w-[4.5rem]"
              style={{ color: "inherit" }}
            >
              {label}
            </p>
          </div>
        </div>
      )}
    </NavLink>
  );
}

export default function NavBar() {
  const { session } = UserAuth();
  const profilePath = session?.user?.id
    ? `/profile/${session.user.id}`
    : "/signin";
  return (
    <nav className="fixed bottom-[2px] left-0 right-0 px-xs pb-[env(safe-area-inset-bottom)]">
      <div className=" rounded-full bg-[rgba(0,0,0,0.90)] px-xs py-xs">
        <ul className="grid grid-cols-5  items-center">
          <li className="flex justify-center">
            <NavItem to="/home" label="Home" Icon={HomeIcon} />
          </li>
          <li className="flex justify-center">
            <NavItem to="/services" label="Services" Icon={ServicesIcon} />
          </li>
          <li className="flex justify-center">
            <NavItem to="/create" label="Create" Icon={CreateIcon} />
          </li>
          <li className="flex justify-center">
            <NavItem to="/chats" label="Chats" Icon={ChatsIcon} />
          </li>
          <li className="flex justify-center">
            <NavItem to={profilePath} label="Profile" Icon={UserIcon} />
          </li>
        </ul>
      </div>
    </nav>
  );
}
