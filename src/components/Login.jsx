import React, { useState } from "react";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = loginForm;

    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    // Store logged-in user in localStorage
    localStorage.setItem("currentUser", JSON.stringify({ email }));
    setError("");
    navigate("/resume-form");
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen mt-6">
      <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
        Login
      </h1>
      <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4">
        {error && <p className="text-red-500 text-center">{error}</p>}
        <InputField
          label="Email"
          name="email"
          value={loginForm.email}
          onChange={handleChange}
          placeholder="Enter your email"
          type="email"
        />
        <InputField
          label="Password"
          name="password"
          value={loginForm.password}
          onChange={handleChange}
          placeholder="Enter your password"
          type="password"
        />
        <button
          type="submit"
          className="w-full bg-blue-400 px-4 py-2 rounded-xl text-white hover:bg-blue-500"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-4">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-300 underline hover:text-blue-500">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;