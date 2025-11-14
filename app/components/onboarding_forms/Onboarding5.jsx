import React, { useState } from "react";
import logo from "../../../assets/images/lineUpPro-logo.svg";
import YellowBtn from "../YellowBtn";
import { useNavigate } from "react-router";

const CheckIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="12"
    viewBox="0 0 16 12"
    fill="none"
  >
    <path
      d="M0.75 6.75L4.75 10.75L14.75 0.75"
      stroke="#FFCF70"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Onboarding5({ onContinue }) {
  const navigate = useNavigate();

  const [selectedCard, setSelectedCard] = useState(null);

  const cards = [
    {
      id: "Monthly",
      price: "58",
      pricePerMonth: "58",
    },
    {
      id: "Yearly",
      price: "348",
      pricePerMonth: "29",
    },
  ];

  const lineUpProPerks = [
    { id: "1", text: "Unlimited collabs" },
    { id: "2", text: "Unlimited connections" },
    { id: "3", text: "Advanced insights" },
    { id: "4", text: "See detailed reviews" },
  ];

  const handleContinue = () => {
    navigate("/home");
  };

  return (
    <div className="w-[260px] flex flex-col items-center gap-8  pb-10">
      <img src={logo} alt="LineUp-pro-logo" />
      <div className="flex flex-col gap-2">
        <h2 className="text-heading3">Get full access to LineUp</h2>
        {lineUpProPerks.map((perk) => (
          <div key={perk.id} className="flex flex-row gap-5 items-center">
            {CheckIcon} <p className="text-m">{perk.text}</p>
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col gap-m items-center">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`relative flex flex-row justify-between w-full border rounded-small px-3 py-5 items-center gap-s
              ${selectedCard === card.id ? "border-yellow" : "border-[#b7b7b7]"}`}
            onClick={() => setSelectedCard(card.id)}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full  border-[#b7b7b7] transition-all duration-200
                 ${selectedCard === card.id ? "bg-yellow" : " border bg-transparent"}`}
            ></div>
            <div className="flex flex-col flex-1 ">
              <p className="text-m font-bold">{card.id}</p>
              <p className="tex-m">{card.pricePerMonth} kr. / month</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <p className="text-m font-bold">{card.price} kr.</p>
              {card.id === "Yearly" && (
                <p className="text-s px-1 rounded-sm bg-yellow">save 50%</p>
              )}
            </div>

            {card.id === "Yearly" && (
              <p className="text-s px-xxs bg-yellow absolute -top-2.5 left-3 rounded-sm font-bold">
                HIT
              </p>
            )}
          </div>
        ))}
        <div className="flex flex-col gap-xs items-center">
          <YellowBtn> Start my 7-day trial</YellowBtn>
          <p className="text-s">Terms of use and Privacy Policy </p>
        </div>
      </div>
      <p className="text-m underline" onClick={handleContinue}>
        Skip for now
      </p>
    </div>
  );
}

export default Onboarding5;
