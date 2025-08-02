import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import TopBar from "./components/TopBar.jsx";
import AlbumList from './FrontPage.jsx';
import AlbumPage from './AlbumPage.jsx';
import UserPage from './UserPage.jsx';
import SearchPage from './SearchPage.jsx';
import AuthContainer from "./components/AuthContainer.jsx";
import UserList from "./components/UserList.jsx";


export default function App() {
  // Central auth state for entire app
  const [username, setUsername] = useState(null);

  // On initial load, check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) setUsername(storedUser);
  }, []);

  return (
    <>
      {/* TopBar receives username and can update it via setUsername */}
      <TopBar username={username} setUsername={setUsername} />

      {/* AuthContainer also receives setUsername to update on login */}
      <Routes>
        <Route path="/" element={<AlbumList />} />
        <Route path="/albums/:id" element={<AlbumPage />} />
        <Route path="/users/:id" element={<UserPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<AuthContainer setUsername={setUsername} />} />
        <Route path="/signup" element={<AuthContainer setUsername={setUsername} />} />
          <Route path="/users" element={<UserList />} />
      </Routes>
    </>
  );
}