// /src/Pages/Login.jsx
import React, { useState } from "react";
import UserService from "../Services/UserService";
import "./LoginPage.css"; // optional styling

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const response = await UserService.loginWithCredentials(username, password);
    if (response.success) {
      // Redirect to your main dashboard or home route
      window.location.href = "/";
    } else {
      setError(response.message || "Login failed!");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Neuract</h2>
        <p className="subtitle">Please log in to continue</p>

        <input
          type="text"
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="login-error">{error}</p>}

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
