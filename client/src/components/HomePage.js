import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../HomePage.css';

function HomePage() {
  const [games, setGames] = useState([]);
  const [topRatedGames, setTopRatedGames] = useState([]);


  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const gamesWithCovers = data.filter(game => game.cover && game.cover.url);
        setGames(gamesWithCovers);
      } catch (error) {
        console.error("Could not fetch games:", error);
      }
    };


    const fetchTopRatedGames = async () => {
      try {
          const response = await fetch('http://localhost:5000/api/games/top-rated');
          const data = await response.json();
          setTopRatedGames(data);
      } catch (error) {
          console.error("Could not fetch top rated games:", error);
      }
  };

    fetchGames();
    fetchTopRatedGames();
  }, []);
  return (
    <div className="homepage">
      <h1>Welcome to the Game Library</h1>
      <div className="content">
        <section className="featured-games">
          <h2>Featured Games</h2>
          {games.map((game) => (
            <Link to={`/games/${game.id}`} className="game" key={game.id}>
              <img src={`https:${game.cover.url}`} alt={`${game.name} cover`} />
              <div className="game-details">
                <h3>{game.name}</h3>
                <div>Genres: {game.genres && game.genres.map(genre => genre.name).join(', ')}</div>
                <div>Platforms: {game.platforms && game.platforms.map(platform => platform.name).join(', ')}</div>
              </div>
            </Link>
          ))}
        </section>
        <section className="top-rated-games">
          <h2>Top Rated Games</h2>
          {topRatedGames.map((game) => (
            <Link to={`/games/${game.id}`} className="game" key={game.id}>
              <img src={`https:${game.cover.url}`} alt={`${game.name} cover`} />
              <div className="game-details">
                <h3>{game.name}</h3>
                <div>Genres: {game.genres && game.genres.map(genre => genre.name).join(', ')}</div>
                <div>Platforms: {game.platforms && game.platforms.map(platform => platform.name).join(', ')}</div>
              </div>
            </Link>
          ))}
        </section>
        {/* ... other sections ... */}
      </div>
    </div>
  );
}


export default HomePage;