import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthContainer() {
  const [mode, setMode] = useState("login"); // or 'register'

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
            <button onClick={() => setMode("register")} className="text-blue-600 underline">Register here</button>
          </p>
        </>
      ) : (
        <>
          <Register onSubmit={handleRegister} />
          <p className="text-center mt-4">
            Already have an account?{" "}
            <button onClick={() => setMode("login")} className="text-blue-600 underline">Login here</button>
          </p>
        </>
      )}
    </div>
  );
}