import { Outlet, useLocation } from "react-router";
import TopBar from "../components/TopBar";
import NavBar from "../components/NavBar";

export default function Layout() {
  const location = useLocation();
  const path = location.pathname;

  const hideTopBar =
    path === "/" ||
    path === "/signup" ||
    path === "/signin" ||
    path === "/chats"; // hides on both /chats and /chats/:id

  const hideNavBar =
    path === "/" ||
    path === "/signup" ||
    path === "/signin" ||
    path.startsWith("/chats/"); // hides ONLY on /chats/:id

  return (
    <main className="main-content">
      {!hideTopBar && <TopBar />}
      {!hideNavBar && <NavBar />}

      <div className={!hideTopBar ? "mt-[60px]" : ""}>
        <Outlet />
      </div>
    </main>
  );
}
