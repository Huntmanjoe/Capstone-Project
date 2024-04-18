import React, { useState } from 'react';
import '../FindGamesPage.css';
import { Link } from 'react-router-dom';
import GameDisplay from './GameDisplay'; 

const FindGamesPage = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [game, setGame] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/games/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ search: searchTerm })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const validData = data.filter(game => game.cover && game.cover.url);
            setSearchResults(validData);
        } catch (error) {
            console.error('Search error:', error);
            setError('Failed to load games.');
        }

        setLoading(false);
    };

    const handleGameClick = async (gameId) => {
        try {
            const response = await fetch(`/api/games/${gameId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch game details');
            }
            const gameData = await response.json();
            console.log('Game details:', gameData);
        
        
            setGame(gameData);
        } catch (error) {
            console.error('Error fetching game details:', error);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch} className="search-bar">
                <input
                    type="text"
                    placeholder="Search games..."
                    value={searchTerm}
                    className="search-input"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <div className="search-results">
                {searchResults.map(game => (
                    <Link to={`/games/${game.id}`} className="game-item" key={game.id} onClick={() => handleGameClick(game.id)}>
                        <img src={`https:${game.cover.url}`} alt={`${game.name} cover`} className="game-cover" />
                        <div className="game-info">
                            <p>{game.name}</p>
                        </div>
                    </Link>
                ))}
            </div>
            {game && <GameDisplay game={game} />}
        </div>
    );
};

export default FindGamesPage;