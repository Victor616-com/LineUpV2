import { supabase } from "../../supabaseClient";
import { UserAuth } from "../../context/AuthContext";
import InputField from "../InputField";
import YellowBtn from "../YellowBtn";
import { useState } from "react";

function Onboarding3({ onContinue }) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [yearOfBirth, setYearOfBirth] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { session } = UserAuth();
  const userId = session?.user?.id;
  const validateForm = ({ name, phoneNumber, yearOfBirth, city }) => {
    if (!name?.trim()) return "Please enter your full name.";

    if (!phoneNumber?.trim()) return "Please enter your phone number.";
    const phoneDigits = phoneNumber.replace(/\D/g, ""); // keep only numbers
    if (phoneDigits.length < 6)
      return "Phone number must contain at least 6 digits.";

    if (!yearOfBirth?.trim()) return "Please enter your year of birth.";

    const year = parseInt(yearOfBirth, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear)
      return "Please enter a valid year of birth.";

    if (!city?.trim()) return "Please enter your city.";

    return null; // no errors
  };
  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Run validation once
    const validationError = validateForm({
      name,
      phoneNumber,
      yearOfBirth,
      city,
    });

    if (validationError) {
      setError(validationError);
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
        {error && <p className="text-m text-red-500 text-center">{error}</p>}
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
