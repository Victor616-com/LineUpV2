import React, { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";
import YellowBtn from "../YellowBtn";
import { UserAuth } from "../../context/AuthContext";

import checkIcon from "../../../assets/images/check-icon.svg";
import logo from "../../../assets/images/small-logo.svg";
function Onboarding2({ onContinue }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { session } = UserAuth();
  const userId = session?.user?.id;
  const handleContinue = async () => {
    if (!selectedCard) {
      setError("Please select a card before continuing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Save selection to Supabase
      const { error } = await supabase
        .from("profiles")
        .update({ type_of_user: selectedCard })
        .eq("id", userId);

      if (error) throw error;

      // Navigate to next step
      onContinue?.();
    } catch (err) {
      console.error("Error saving selection:", err);
      setError("Failed to save your selection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      id: "musician",
      heading: "I am a musician",
      description: "I am a musician looking for collaborations and services",
    },
    {
      id: "non_musician",
      heading: "Not a musician",
      description: "I want to provide services for musicians",
    },
  ];

  return (
    <div className="flex flex-col gap-m w-[225px] items-center">
      <img src={logo} alt="LineUp-logo" className="h-[30px] w-auto" />
      {error && <p className="text-m text-red-500 text-center">{error}</p>}
      {cards.map((card) => (
        <div
          key={card.id}
          className={`flex flex-col items-center gap-[20px] px-[20px] py-[20px] rounded-small border transition-all duration-200
              ${
                selectedCard === card.id
                  ? "border-[#808080]"
                  : "border-[#b7b7b7]"
              }`}
          onClick={() => {
            setSelectedCard(card.id);
            setError("");
          }}
        >
          <p className="text-heading2">{card.heading}</p>
          <p className="text-m text-center">{card.description}</p>
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full border border-[#b7b7b7] transition-all duration-200
            ${selectedCard === card.id ? "bg-yellow border-transparent" : "bg-transparent"}`}
          >
            <img src={checkIcon} alt="check" />
          </div>
        </div>
      ))}
      <YellowBtn
        loading={loading}
        loadingText="Saving..."
        onClick={handleContinue}
      >
        Continue
      </YellowBtn>
    </div>
  );
}

export default Onboarding2;
