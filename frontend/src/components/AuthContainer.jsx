import { useState,useEffect} from "react";
import Login from "./Login";
import Register from "./Register";
import {useLocation, useNavigate} from "react-router-dom";

export default function AuthContainer() {
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  useEffect(()=>{
    if (location.pathname === "/signup"){
      setMode("register");
    }
    if (location.pathname === "/login"){
      setMode("login");
    }
  }, [location,setMode]);


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
        navigate('/');
        // window.location.reload();
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
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        alert("success");
        navigate("/login");
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
            <button onClick={() => navigate("/signup")}>Register here!</button>
          </p>
        </>
      ) : (
        <>
          <Register onSubmit={handleRegister} />
          <p className="text-center mt-4">
            Already have an account?{" "}
            <button
              onClick={() => {
                navigate("/login");
              }}
            >
              Login Here!
            </button>
          </p>
        </>
      )}
    </div>
  );
}