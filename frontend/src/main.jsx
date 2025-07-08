import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

fetch('http://localhost:8000/api/albums')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('album-list');
    data.forEach(album => {
      const li = document.createElement('li');
      li.textContent = `${album.title} by ${album.artist} (${album.year})`;
      list.appendChild(li);
    });
  })
  .catch(err => console.error(err));