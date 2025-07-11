// App.jsx
import React, { useEffect, useState } from 'react'
import AlbumCard from './AlbumCard'
import logo from './assets/soundcheck logo.png'

export default function App() {
  const [albums, set_albums] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/albums')
      .then((res) => res.json())
      .then(set_albums)
  }, [])

  return (
   <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <img src={logo} alt="Logo" style={{ width: '280px' }} />
      <h1 className="text-3xl font-bold text-center text-white mb-8">Albums</h1>
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </main>
  )
}
