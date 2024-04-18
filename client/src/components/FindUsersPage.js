import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../FindUsersPage.css';
import { Link, useHistory } from 'react-router-dom';


const FindUsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);  
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ search: searchTerm })
            });
            const data = await response.json();
            if (response.ok) {
                setSearchResults(data);
            } else {
                throw new Error(data.message || "Error fetching users");
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]); 
        }
    };

    return (
        <div className="find-users-container">
            <form onSubmit={handleSearch} className="find-users-bar">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    className="find-users-input"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="find-users-button">Search</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <div className="find-users-results">
                {searchResults.map(user => (
                    <Link to={`/profile/${user.username}`} className="find-users-item" key={user.username}>
                        <img src={user.profile_pic || "/Defaultpfp.png"} alt={`${user.username}'s profile`} className="find-users-pic" />
                        <p className="find-users-name">{user.username}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FindUsersPage;