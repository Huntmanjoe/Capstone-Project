import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../UserProfile.css';

const UserProfile = () => {
    const params = useParams();  
    const [profile, setProfile] = useState({ username: '', email: '', joined: '', profile_pic: null, collection: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:5000/api/profile/${params.username}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const data = await response.json();
                console.log('Profile Data:', data);

                setProfile({
                    username: data.username,
                    email: data.email,
                    joined: data.joined,
                    profile_pic: data.profile_pic,
                    collection: data.collection,
                });

                setLoading(false);
            } catch (error) {
                console.error('Fetch error:', error);
                setError('Failed to load profile data.');
                setLoading(false);
            }
        }

        fetchData();
    }, [params.username]);  

    const removeGameFromCollection = async (gameId) => {
        const confirmRemove = window.confirm('Are you sure you want to remove this game from your collection?');
        if (confirmRemove) {
            try {
                const token = localStorage.getItem('accessToken'); 
                
       
                const currentUsername = profile.username;
    
             
                if (params.username !== currentUsername) {
                    window.alert("This is not your profile!");
                    console.error('Unauthorized: You are not allowed to remove games from this profile.');
                    return;
                }
    
                const response = await fetch(`http://localhost:5000/api/profile/remove_from_collection/${gameId}`, {
                    method: 'DELETE',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Failed to remove game from collection');
                }
    
            
                const updatedProfile = { ...profile };
                updatedProfile.collection = updatedProfile.collection.filter(game => game[0].id !== gameId);
                setProfile(updatedProfile);
            } catch (error) {
                console.error('Error removing game:', error);
            
            }
        }
    };
    return (
        <div className="profile-container">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <div className="profile-header">
                        <h1>{profile.username}'s Profile</h1>
                        <img src={profile.profile_pic || "/Defaultpfp.png"} alt={`${profile.username}'s profile`} className="profile-picture" />
                    </div>
                    <div className="profile-content">
                        <h2>{profile.username}'s Collection:</h2>
                        {profile.collection && profile.collection.length > 0 ? (
                            <div className="collection">
                                {profile.collection.map((gameData, index) => (
                                    <div key={index} className="collection-item">
                                        <Link to={`/games/${gameData[0].id}`}>
                                            <img src={`http:${gameData[0].cover.url}`} alt={`${gameData[0].name} cover`} className="collection-cover" />
                                        </Link>
                                        <p>{gameData[0].name}</p>
                                        <div className="remove-btn" onClick={() => removeGameFromCollection(gameData[0].id)}>Remove from collection</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No collections found.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default UserProfile;