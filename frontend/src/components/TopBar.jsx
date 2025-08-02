// TopBar Component 

import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Group, Image, Menu, Text, Avatar } from '@mantine/core';
import logo from '../assets/soundcheck logo.png';           // Logo
import { TextInput } from '@mantine/core';


// TopBar receives username and setUsername as props from App
export default function TopBar({ username, setUsername }) {
  const [userId, setUserId] = useState(null);
  const [search_query, set_search_query] = useState('');
  const[is_admin, setIsAdmin] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const storedId = localStorage.getItem('user_id');
    if (storedId) setUserId(storedId);
    const adminFlag = localStorage.getItem("is_admin");
    setIsAdmin(adminFlag === 'true' || adminFlag === true);
  }, []);

   // Called when user clicks logout
  const handleLogout = () => {
    localStorage.removeItem("Authenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setUsername(null);
    window.location.href = "/login";
  };

  const handle_search_submit = (e) => {
    e.preventDefault();
    if (search_query.trim()) {
      navigate(`/search?q=${encodeURIComponent(search_query.trim())}`);
      set_search_query('');
    }
  };

  return (
    <div className="glass-card-header" style={{ display: 'flex', 
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none',
    borderRadius: '0px',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderRadius: '5px', 
    padding: '0.1rem 1rem', 
    background: '#262e4a' }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{ display: 'inline-block', width: 100 }}>
          <Image src={logo} alt="Logo" fit="contain" />
        </span>
      </Link>

      {/* Search */}
      { username && (
      <form onSubmit={handle_search_submit} style={{ flexGrow: 0.2, margin: '0 1rem' }}>
        <TextInput
          value={search_query}
          onChange={(e) => set_search_query(e.currentTarget.value)}
          placeholder="Search albums or artists..."
          radius="md"
          size="sm"
        />
      </form>)}

      <Group>
        {username ? (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Avatar color="blue" radius="xl" style={{ cursor: 'pointer' }}>
                {username[0]?.toUpperCase()}
              </Avatar>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Welcome, {username}</Menu.Label>
              <Menu.Item onClick={() => navigate(`/users/${userId}`)}>Your Page</Menu.Item>
              {is_admin && (
                <Menu.Item onClick={() => navigate("/users")}>Admin Panel</Menu.Item>
              )}
              <Menu.Divider />
              <Menu.Item color="red" onClick={handleLogout}>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <>
            <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="filled" onClick={() => navigate('/signup')}>Sign Up</Button>
          </>
        )}
      </Group>
    </div>
  );
}