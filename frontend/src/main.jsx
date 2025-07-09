import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import AuthContainer from "./components/AuthContainer";
import "./index.css";

export function App() {
  const [albums, setAlbums] = useState([]);
  const [Authenticated, setAuthenticated] = useState(false);

  useEffect(() =>{
    const auth = localStorage.getItem("Authenticated");
    if (auth==="true"){
      setAuthenticated(true);
    }
  },[]);
  useEffect(() => {
      if(Authenticated){
    fetch('http://localhost:8000/api/albums')
      .then((res) => res.json())
      .then((data) => setAlbums(data))
      .catch((err) => console.error('Failed to fetch albums:', err));
      }
  }, [Authenticated]);


  function handlelogout(){
    localStorage.removeItem("Authenticated");
    setAuthenticated(false);
  }

  return (
    <main className="p-6">
      {!Authenticated ? (
        <AuthContainer onLogin={() => setAuthenticated(true)}/>
      ) : (
        <>
          <button className = "logout-button" onClick={(handlelogout)}>Logout</button>
          <h1 className="text-2xl font-bold mb-4">Albums</h1>
          <ul className="space-y-4">
            {albums.map((album) => (
              <li key={album.id} className="border rounded p-4 shadow">
                <h2 className="text-xl font-semibold">{album.title}</h2>
                <p className="text-gray-600">
                  {album.artist} ({album.year})
                </p>
                {album.cover_url && (
                  <img
                    src={album.cover_url}
                    alt={album.title}
                    className="mt-2 w-40 rounded"
                  />
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);