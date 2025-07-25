import { useState } from "react";

export default function Register({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    onSubmit({ username, password, email});
  }

  return (
      <div className="login-wrapper">
    <form onSubmit={handleSubmit} >
      <h2 className="login-header">Register</h2>
      {error && <p>{error}</p>}
      <input
          className="input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={event => setUsername(event.target.value)}
      />
      <input
        className="input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={event =>setEmail(event.target.value)}
        />
      <input
          className="input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={event => setPassword(event.target.value)}
      />
      <input
          className='input'
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={event => setConfirmPassword(event.target.value)}
      />
      <button type="submit" className='login-button'>Register</button>
    </form>
      </div>
  );
}