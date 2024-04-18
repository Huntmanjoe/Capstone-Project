import React from 'react';

function Footer() {
    return (
        <footer className="footer">
            <div>© {new Date().getFullYear()} GameList. All rights reserved.</div>
            <div className="footer-links">
                <a href="https://twitter.com/yourhandle" className="footer-link">Twitter</a>
                <a href="https://facebook.com/yourpage" className="footer-link">Facebook</a>
                <a href="https://instagram.com/yourhandle" className="footer-link">Instagram</a>
            </div>
        </footer>
    );
}

export default Footer;