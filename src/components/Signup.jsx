import React, { useState } from "react";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const { email, password, confirm_password } = signUpForm;

    if (!email || !password || !confirm_password) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    // Store user in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((user) => user.email === email)) {
      setError("User already exists.");
      return;
    }
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));

    setError("");
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen mt-6">
      <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
        Sign Up
      </h1>
      <form onSubmit={handleSignup} className="max-w-md mx-auto space-y-4">
        {error && <p className="text-red-500 text-center">{error}</p>}
        <InputField
          label="Email"
          name="email"
          value={signUpForm.email}
          onChange={handleChange}
          placeholder="Enter your email"
          type="email"
        />
        <InputField
          label="Password"
          name="password"
          value={signUpForm.password}
          onChange={handleChange}
          placeholder="Enter your password"
          type="password"
        />
        <InputField
          label="Confirm Password"
          name="confirm_password"
          value={signUpForm.confirm_password}
          onChange={handleChange}
          placeholder="Confirm your password"
          type="password"
        />
        <button
          type="submit"
          className="w-full bg-blue-400 px-4 py-2 rounded-xl text-white hover:bg-blue-500"
        >
          Sign Up
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-300 underline hover:text-blue-500">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;