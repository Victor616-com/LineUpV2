import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UserAuth } from "../context/AuthContext"; // adjust path
import logo from "../../assets/images/logo-purple.svg";

function Onboarding() {
  const [showContent, setShowContent] = useState(false); // change to true if testing onboarding part
  const navigate = useNavigate();
  const { session } = UserAuth(); // get current user session

  useEffect(() => {
    // Play splash animation for first-time or returning users
    const timer = setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
      // If user is already signed in → go to home
      if (session?.user) {
        navigate("/home");
        return;
      }
      if (hasSeenOnboarding) {
        // Returning user → go to signin
        navigate("/signin");
      } else {
        // First-time user → show welcome screen
        setShowContent(true);
      }
    }, 5000); // animation duration

    return () => clearTimeout(timer);
  }, [navigate, session]);

  const handleGetStarted = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/signup");
  };

  if (showContent) {
    return (
      <div className="w-full h-dvh flex flex-col gap-l justify-center items-center bg-white">
        <h1 className="text-2xl">Welcome to Lineup 🎶</h1>
        <button
          className="bg-yellow w-fit px-xs py-xxs rounded-medium cursor-pointer"
          onClick={handleGetStarted}
        >
          Get started
        </button>
      </div>
    );
  }

  return (
    <div className="onboarding-screen w-full h-dvh flex justify-center items-center bg-yellow">
      <img src={logo} alt="lineup logo" className="logo-anim" />
    </div>
  );
}

export default Onboarding;
