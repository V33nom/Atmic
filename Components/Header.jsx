import React, { useState } from 'react';
import { Link } from 'react-router-dom';


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="rv-header" style={{ position: 'relative' }}>
      <div className="rv-logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }} onClick={closeMenu}>
          
          Ātmic" (आत्मिक)
        </Link>
      </div>
      {/* Hamburger for tablet/mobile */}
      <button
        className="rv-hamburger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="rv-mobile-nav"
      >
        {isOpen ? '✕' : '☰'}
      </button>
      {/* Navigation links */}
      <nav className={`rv-nav ${isOpen ? 'rv-nav-mobile-open' : ''}`} id="rv-mobile-nav">
        <Link to="/chatbot" onClick={closeMenu}>Ask</Link>
        <Link to="/narration" onClick={closeMenu}>Narrate</Link>
        <Link to="/explorer" onClick={closeMenu}>Explore</Link>
       
        <Link to="/quiz" onClick={closeMenu}>Quiz</Link>
      
        <Link to="/api" onClick={closeMenu}>API</Link>
        <Link to="/cards" onClick={closeMenu}>Cards</Link>
      </nav>
      <button className="rv-btn rv-btn-desktop">
        <Link to="/chatbot" style={{ textDecoration: 'none', color: 'inherit' }} onClick={closeMenu}>
          Let's Talk
        </Link>
      </button>
    </header>
  );
}
