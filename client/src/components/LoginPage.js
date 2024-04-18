import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginPage.css';

function LoginPage({ handleLogin, ...otherProps }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const login = async () => {
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log("Login response data:", data);  
    
            const token = data.access_token;
           
            console.log("Token:", token); 
            console.log("Token type:", typeof token); 
    
           
            localStorage.setItem('accessToken', token);  
            console.log("Stored token immediately after setItem:", localStorage.getItem('accessToken')); 
    
     
            handleLogin(token, username ); 
            navigate('/');  
        } catch (error) {
            console.error('Error during login:', error);
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <h2>Login</h2>
                <form className="login-form" onSubmit={(e) => { e.preventDefault(); login(); }}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="login-button">Log in</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
                <div className="signup-link">
                    <p>Don't have an account? <button onClick={() => navigate('/signup')} className="signup-button">Sign up!</button></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;