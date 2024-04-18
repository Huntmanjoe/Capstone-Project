import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../SignUpPage.css';

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
    
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
    
            if (!response.ok) {
                throw new Error('Sign up failed');
            }
    
            console.log('Signup data sent successfully to the backend');
    
            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form-wrapper">
                <h2>Sign Up</h2>
                <form className="signup-form" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="signup-button">Sign Up</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;