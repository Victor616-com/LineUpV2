"use client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import YellowBtn from "../components/YellowBtn";
import ProgressBar from "../components/ProgressBar";
import Onboarding2 from "../components/onboarding_forms/Onboarding2";
import Onboarding3 from "../components/onboarding_forms/Onboarding3";
import Onboarding4 from "../components/onboarding_forms/Onboarding4";
import Onboarding5 from "../components/onboarding_forms/Onboarding5";

const SignUp = () => {
  // User info states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const totalSteps = 5; // sign-up + 4 onboarding steps
  const [error, setError] = useState();
  const [loading, setLoading] = useState("");

  const { signUpNewUser } = UserAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    //Check password match before calling Supabase
    if (password !== confirmPassword) {
      setError("Passwords do not match. Try again.");
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
      return;
    }

    try {
      const result = await signUpNewUser(email, password);
      if (result.success) {
        setStep(2); // move to onboarding step 2
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };
  const progressPercent = (step / totalSteps) * 100;
  return (
    <div className="h-dvh flex flex-col items-center justify-between relative gap-m">
      <ProgressBar width={`${progressPercent}%`}></ProgressBar>
      <div className="w-full flex flex-1 justify-center items-center">
        {step === 1 && (
          <form
            onSubmit={handleSignup}
            className="w-[260px] flex flex-col items-center gap-m"
          >
            <h2 className="text-heading1">Sign Up</h2>
            <div className="flex flex-col gap-s w-full">
              <p className="text-m text-center">
                By continuing you agree to LineUp! Terms of use and Privacy
                Policy.
              </p>
              {/* Email Field */}
              <InputField
                placeholder="Enter your email"
                value={email}
                type="email"
                onChange={setEmail}
              />

              {/* Password Field */}
              <InputField
                placeholder="Enter your password"
                value={password}
                type="password"
                onChange={setPassword}
              />

              {/*Confirm Password Field */}
              <InputField
                placeholder="Confirm your password"
                value={confirmPassword}
                type="password"
                onChange={setConfirmPassword}
              />
            </div>

            <YellowBtn
              type="submit"
              loading={loading}
              loadingText="Signing Up..."
            >
              Sign Up
            </YellowBtn>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <p>
              Already have an account?
              <Link className="text-blue-500" to="/signin">
                {" "}
                Sign in
              </Link>
            </p>
          </form>
        )}
        {step === 2 && <Onboarding2 onContinue={() => setStep(3)} />}
        {step === 3 && <Onboarding3 onContinue={() => setStep(4)} />}
        {step === 4 && <Onboarding4 onContinue={() => setStep(5)} />}
        {step === 5 && <Onboarding5 onContinue={() => navigate("/home")} />}
      </div>
    </div>
  );
};

export default SignUp;
