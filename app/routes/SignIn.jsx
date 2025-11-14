"use client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { UserAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import YellowBtn from "../components/YellowBtn";
//import logo from "../../assets/images/small-logo.svg";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState("");

  const { signInUser } = UserAuth();
  const navigate = useNavigate();
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        navigate("/home");
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError("An error occured during sign-in.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-dvh flex flex-col gap-[60px] justify-center items-center px-4 py-6 overflow-auto">
      {/*<img src={logo} alt="LineUp-logo" />*/}
      <form
        onSubmit={handleSignIn}
        className="w-[260px] rounded-lg flex flex-col gap-m items-center"
      >
        <h2 className="text-heading1">Log In</h2>

        <div className="w-full flex flex-col gap-s">
          <InputField
            placeholder="Enter your email"
            type="email"
            onChange={setEmail}
          />
          <InputField
            placeholder="Enter your password"
            type="password"
            onChange={setPassword}
          />
        </div>
        <YellowBtn type="submit" loading={loading} loadingText="Signing In...">
          Sign In
        </YellowBtn>

        <p className="text-m">
          Don't have an account?{" "}
          <Link className="text-blue-500" to="/signup">
            Sign up
          </Link>
        </p>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default SignIn;
