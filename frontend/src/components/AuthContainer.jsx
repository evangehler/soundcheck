import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthContainer() {
  const [mode, setMode] = useState("login");

  async function handleLogin(data) {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("Authenticated", "true");
        window.location.reload();
      } else {
        alert(result.detail || "Invalid login");
      }
    }catch(error) {
      alert("server error");
      console.error(error);
    }
  }


  async function handleRegister(data) {
    console.log("Register data:", data);
    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        alert("success");
        window.location.reload();
      } else {
alert(result.detail ?? result.message ?? JSON.stringify(result) ?? "fail");
      }
    }catch(error) {
      alert("server error");
      console.error(error);
    }
  }

  return (
    <div>
      {mode === "login" ? (
        <>
          <Login onSubmit={handleLogin} />
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <button onClick={() => setMode("register")}>Register here!</button>
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