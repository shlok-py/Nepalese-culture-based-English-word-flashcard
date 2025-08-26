import { useState } from "react";
import "../style/form.css"

export default function AuthForm({ mode = "login", onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const title = mode === "login" ? "Login" : "Sign Up";

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ username, password });
  };

  return (
    <div className="form-wrapper">
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{title}</h1>

      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />

      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <button className="form-button" type="submit">
        {title}
      </button>
    </form>
    </div>

  );
}
