import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import HomePage from './HomePage';
import Footer from './Footer';
import GameDisplay from './GameDisplay';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage'; 
import FindGamesPage from './FindGamesPage';
import FindUsersPage from './FindUsersPage';
// import LoginPage from './LoginPage';
import UserProfile from './UserProfile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [games, setGames] = useState([]); 
  const [user, setUser] = useState(null);


  useEffect(() => {
    const fetchGames = async () => {
      try {
        const featuredResponse = await fetch('http://localhost:5000/api/games');
        if (!featuredResponse.ok) {
          throw new Error(`HTTP error! status: ${featuredResponse.status}`);
        }
        const featuredData = await featuredResponse.json();


        const topRatedResponse = await fetch('http://localhost:5000/api/games/top-rated');
        if (!topRatedResponse.ok) {
          throw new Error(`HTTP error! status: ${topRatedResponse.status}`);
        }
        const topRatedData = await topRatedResponse.json();

        const combinedGames = [...featuredData, ...topRatedData];

        const gamesWithCovers = combinedGames.filter(game => game.cover && game.cover.url);

        setGames(gamesWithCovers);
      } catch (error) {
        console.error("Could not fetch games:", error);
      }
    };

    fetchGames();
  }, []);


  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  const handleLogin = (token, username) => {
    setUser({ username: username });
    setIsLoggedIn(true);
    console.log("Token type:", typeof token); 
    localStorage.setItem('accessToken', token);
    console.log('Stored token:', localStorage.getItem('accessToken')); 
    localStorage.setItem('user', JSON.stringify({ username: username }));
  };

console.log("IsLoggedIn in App:", isLoggedIn); 
const accessToken = localStorage.getItem('accessToken');

if (accessToken) {
  console.log('Authentication token exists:', accessToken);
} else {
  console.log('Authentication token does not exist.');
}

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage games={games} />} />
        <Route path="/games/:id" element={<GameDisplay games={games} isLoggedIn={isLoggedIn}/>} />
        <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile/:username" element={<UserProfile user={user} />} />
        <Route path="/find-games" element={<FindGamesPage user={user} />} />
        <Route path="/find-users" element={<FindUsersPage />} />
        <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
        {/* ... other routes */}
        
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;