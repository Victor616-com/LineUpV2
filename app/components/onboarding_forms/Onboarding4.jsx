import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import checkIcon from "../../../assets/images/check-icon.svg";
import YellowBtn from "../YellowBtn";

function Onboarding4({ onContinue }) {
  const [selectedCards, setSelectedCards] = useState([]); // Array of selected cards
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { session } = UserAuth();
  const userId = session?.user?.id;

  const cards = [
    { id: "1", text: "Connect to fellow musicians" },
    { id: "2", text: "Promote my music" },
    { id: "3", text: "Find a band to play with" },
    { id: "4", text: "Find services for my music" },
  ];

  const handleCardClick = (id) => {
    if (selectedCards.includes(id)) {
      // If already selected, remove it (deselect)
      setSelectedCards(selectedCards.filter((cardId) => cardId !== id));
    } else {
      // If not selected, add it
      setSelectedCards([...selectedCards, id]);
    }
  };

  const handleContinue = async () => {
    if (!selectedCards) {
      setError("Please select a card before continuing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const selectedTexts = cards
        .filter((card) => selectedCards.includes(card.id))
        .map((card) => card.text);

      // Save selection to Supabase
      const { error } = await supabase
        .from("profiles")
        .update({ looking_to: selectedTexts })
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

  return (
    <div className="flex flex-col w-[270px] gap-[20px] items-center">
      {error && <p className="text-m text-red-500 text-center">{error}</p>}
      <h2 className="text-heading3 w-full">I am looking to</h2>
      <div className="w-full flex flex-col gap-s">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`w-full flex flex-row gap-s px-xs py-s rounded-full border border-[#b7b7b7] transition-all duration-200 cursor-pointer
             ${selectedCards.includes(card.id) ? "border-yellow" : "border-[#b7b7b7]"}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full border-[#b7b7b7]  transition-all duration-200
              ${selectedCards.includes(card.id) ? "bg-yellow" : "bg-transparent border"}`}
            >
              <img src={checkIcon} alt="check" />
            </div>
            <p className="text-m">{card.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-col items-center gap-s">
        <YellowBtn
          loading={loading}
          loadingText="Saving..."
          onClick={handleContinue}
        >
          Continue
        </YellowBtn>
        <p className="text-m underline" onClick={() => onContinue?.()}>
          Skip for now
        </p>
      </div>
    </div>
  );
}

export default Onboarding4;
