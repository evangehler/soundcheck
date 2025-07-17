// TopBar Component 

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Group, Image } from '@mantine/core';
import logo from '../assets/soundcheck logo.png';           // Logo

// TopBar receives username and setUsername as props from App
export default function TopBar({ username, setUsername }) {
  const navigate = useNavigate();

   // Called when user clicks logout
  const handleLogout = () => {
    localStorage.removeItem("Authenticated");
    localStorage.removeItem("username");
    setUsername(null);
    window.location.href = "/login";
  };

  return (
    <div className="glass-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#262e4a' }}>

      {/* Clicking logo navigates home */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{ display: 'inline-block', width: 100 }}>
          <Image src={logo} alt="Logo" fit="contain" />
        </span>
      </Link>

      <Group>
        {username ? (
        // Show logout and username if logged in
          <>
            <span style={{ color: 'white' }}>Logged in as <strong>{username}</strong></span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>

          </>
        ) : (
        // Otherwise show login/signup buttons
          <>
            <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="filled" onClick={() => navigate('/signup')}>Sign Up</Button>
          </>
        )}
      </Group>
    </div>
  );
}