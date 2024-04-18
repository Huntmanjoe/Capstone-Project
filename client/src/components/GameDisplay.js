import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 

function GameDisplay({ games, isLoggedIn}) {
    const [inCollection, setInCollection] = useState(false);
    const { id } = useParams(); 
    const [game, setGame] = useState(null);
    console.log("Game ID:", id);
    console.log("Games:", games);
    console.log("Game:", game);
    console.log("isLoggedIn in GameDisplay:", isLoggedIn); 


    useEffect(() => {
        
    }, [games, id]);

    useEffect(() => {
    
        const fetchGameData = async () => {
          try {
            const response = await fetch(`/api/games/${id}`);
            if (!response.ok) {
              throw new Error('Failed to fetch game data');
            }
            const gameData = await response.json();
            setGame(gameData);
          } catch (error) {
            console.error('Error fetching game data:', error);
          }
        };
    
        fetchGameData(); 
      }, [id]);

    if (!game) {
        return <div>Loading...</div>; 
    }

    const handleCollectionToggle = async () => {
        if (!isLoggedIn) {
            alert("Please log in to add this game to your collection.");
            return;
        }
    
        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.log("No access token available.");
            alert("No access token found. Please log in again.");
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5000/api/profile/add_to_collection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ gameId: id })  
            });
    
            if (!response.ok) {
                const resData = await response.json(); 
                throw new Error(resData.message || 'Failed to add game to collection');
            }
    
            const result = await response.json();
            alert(result.message);
            setInCollection(true);  
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error adding game to collection');
        }
    };
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{game[0].name}</h2>
            {game[0].cover && <img src={game[0].cover.url.replace('/t_thumb/', '/t_cover_big/')} alt={`${game[0].name} cover`} style={styles.cover} />}
            <p style={styles.summary}>{game[0].summary || 'Summary not available'}</p>
            <p style={styles.info}><strong>Rating:</strong> {game[0].rating || 'Unknown'}</p>
            <p style={styles.info}><strong>Genres:</strong> {game[0].genres ? game[0].genres.map(genre => genre.name).join(', ') : 'Unknown'}</p>
            <p style={styles.info}><strong>Platforms:</strong> {game[0].platforms ? game[0].platforms.map(platform => platform.name).join(', ') : 'Unknown'}</p>
            <button onClick={() => handleCollectionToggle(game[0].id)} style={styles.button}>
    {           inCollection ? 'Remove from Collection' : 'Add to Collection'}
            </button>
        </div>
    );
}
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        maxWidth: '600px',
        margin: 'auto',
        marginTop: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '24px',
        marginBottom: '10px',
    },
    cover: {
        width: '100%',
        maxWidth: '400px',
        marginBottom: '20px',
    },
    summary: {
        marginBottom: '20px',
    },
    info: {
        marginBottom: '10px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default GameDisplay;