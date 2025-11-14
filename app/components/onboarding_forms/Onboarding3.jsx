import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import InputField from "../InputField";
import YellowBtn from "../YellowBtn";
import { useState } from "react";

function Onboarding3({ onContinue }) {
  const [name, setName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [yearOfBirth, setYearOfBirth] = useState(null);
  const [city, setCity] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { session } = UserAuth();
  const userId = session?.user?.id;

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || name.trim().length === 0) {
      setError("Please enter your full name.");
      setLoading(false);
      return;
    }

    try {
      // Save selection to Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          name: name,
          phone_number: phoneNumber,
          year_of_birth: yearOfBirth,
          city: city,
        })
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
    <div className="flex flex-col w-[260px]">
      <form
        onSubmit={handleContinue}
        className="flex flex-col w-full gap-m items-center"
      >
        <InputField
          label="First & last name"
          placeholder="Enter your first & last name"
          value={name}
          type="name"
          onChange={setName}
          capitalizeWords
        />
        <InputField
          label="Phone number"
          placeholder="Phone number"
          value={phoneNumber}
          type="tel"
          onChange={setPhoneNumber}
        />
        <InputField
          label="Year of birth"
          placeholder="Enter your year of birth"
          value={yearOfBirth}
          type="number"
          onChange={setYearOfBirth}
        />
        <InputField
          label="Where do you live?"
          placeholder="Enter your city"
          value={city}
          type="text"
          onChange={setCity}
        />
        <div className="w-fit mt-5">
          <YellowBtn type="submit" loading={loading} loadingText="Loading...">
            Continue
          </YellowBtn>
        </div>
      </form>
    </div>
  );
}

export default Onboarding3;
