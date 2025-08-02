import { useState,useEffect} from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import {useLocation, useNavigate} from "react-router-dom";


// Receives setUsername prop from App.jsx
export default function AuthContainer({ setUsername }) {
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  
  // Switch form view based on route
  useEffect(()=>{
    if (location.pathname === "/signup"){
      setMode("register");
    }
    if (location.pathname === "/login"){
      setMode("login");
    }
  }, [location,setMode]);

  // Send login request and update app-level username
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
        localStorage.setItem("username", result.username);
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("user_id", result.user_id);
        localStorage.setItem("is_admin",result.is_admin)
        console.log("Login result:", result);
        setUsername(result.username);
        navigate('/');
      } else {
        alert(result.detail || "Invalid login");
      }
    } catch (error) {
      alert("server error");
      console.error(error);
    }
  }

  // Send signup request and redirect to login
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
            <button className="login-button" onClick={() => navigate("/signup")}>Register here!</button>
        </>
      ) : (
        <>
          <Register onSubmit={handleRegister} />
            <button className='login-button' onClick={() => {navigate("/login");}}>Login Here!</button>
        </>
      )}
    </div>
  );
}