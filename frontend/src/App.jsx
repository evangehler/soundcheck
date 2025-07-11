import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AlbumList from './FrontPage.jsx';
import AlbumPage from './AlbumPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AlbumList />} />
      <Route path="/albums/:id" element={<AlbumPage />} />
    </Routes>
  );
}
