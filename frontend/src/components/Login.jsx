import {useState } from "react";


export default function Login({ onSubmit }) {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!username || !password) {
      setError("Please fill in both fields");
      return;
    }
    setError("");
    onSubmit({username,password});
  }

  return (
      <div className="login-wrapper">
    <form onSubmit={handleSubmit} >
        <h1 className={"header-container"}></h1>
      <h2 className="login-header">Login</h2>
      {error && <p>{error}</p>}
      <input
          className = "login-box"
        type="text"
        placeholder="Username"
        value={username}
        onChange={event => setUsername(event.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={event => setPassword(event.target.value)}
        className="login-box"
      />
      <button type="submit" className="login-button">Log In</button>
    </form>
      </div>
  );
}