import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
//import '@mantine/core/styles.css';
import AuthContainer from "./components/AuthContainer";
import "./index.css";

// export function App() {
//   const [albums, setAlbums] = useState([]);
//   const [Authenticated, setAuthenticated] = useState(false);


  // useEffect(() =>{
  //   const auth = localStorage.getItem("Authenticated");
  //   if (auth==="true"){
  //     setAuthenticated(true);
  //   }
  // },[]);
  // useEffect(() => {
  //     if(Authenticated){
  //   fetch('http://localhost:8000/api/albums')
  //     .then((res) => res.json())
  //     .then((data) => setAlbums(data))
  //     .catch((err) => console.error('Failed to fetch albums:', err));
  //     }
  // }, [Authenticated]);
  //
  //
  // // function handlelogout(){
  // //   localStorage.removeItem("Authenticated");
  // //   setAuthenticated(false);
  // // }
  ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MantineProvider>
);


