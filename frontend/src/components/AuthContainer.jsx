import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthContainer() {
  const [mode, setMode] = useState("login");

  function handleLogin(data) {
    console.log("Login data:", data);
  }

  function handleRegister(data) {
    console.log("Register data:", data);
  }
  return (
    <div>
      {mode === "login" ? (
        <>
          <Login onSubmit={handleLogin} />
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <button onClick={() => setMode("register")}>Register here</button>
          </p>
        </>
      ) : (
        <>
          <Register onSubmit={handleRegister} />
          <p className="text-center mt-4">
            Already have an account?{" "}
            <button onClick={() => setMode("login")}>Login here</button>
          </p>
        </>
      )}
    </div>
  );
}