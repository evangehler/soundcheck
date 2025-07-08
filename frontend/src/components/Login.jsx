import {useState } from "react";


export default function Login({ onSubmit }) {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in both fields");
      return;
    }
    setError("");
    onSubmit({username,password});
  }

  return (
      <div className="login-wrapper">
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 flex flex-col gap-4 border rounded">
<h1 className={"header-container"}></h1>
      <h2 className="text-2xl font-semibold">Login</h2>
      {error && <p className="text-red-600">{error}</p>}
      <input
          className = "login-box"
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        // className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="login-box"
      />
      <button type="submit" className="login-button">Log In</button>
    </form>
      </div>
  );
}