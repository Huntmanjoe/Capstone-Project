import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = ({ isLoggedIn, handleLogout, user }) => {
    const handleLogoutClick = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            handleLogout();
        }
    };

    return (
        <nav className="navbar">
            {/* Site title and logo */}
            <Link to="/" className="navbar-brand">
                <div className="site-title">GameList</div>
            </Link>

            {/* Navigation links */}
            <div className="navbar-nav">
                <NavLink exact="true" to="/" className="nav-link">
                    Home
                </NavLink>
                <NavLink to="/find-games" className="nav-link">
                    Find Games
                </NavLink>
                <NavLink to="/find-users" className="nav-link">
                    Find Users
                </NavLink>
                {isLoggedIn ? (
                    <>
                        {/* Show when user is logged in */}
                        <NavLink to={`/profile/${user.username}`} className="nav-link">
                            My Profile
                        </NavLink>
                        <button onClick={handleLogoutClick} className="nav-button">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        {/* Show when user is logged out */}
                        <NavLink to="/login" className="nav-link">
                            Login
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;