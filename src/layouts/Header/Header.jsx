import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './Header.module.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={style.header}>
      <div className={style.navbar}>
        <div className={style.logo}>
          <p>Logo</p>
        </div>
        <button className={style.hamburger} onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </button>
        {/* Desktop Menu */}
        <nav className={`${style.menu} ${isOpen ? style.active : ''}`}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </div>
      {/* Overlay for mobile */}
      {isOpen && <div className={style.overlay} onClick={toggleMenu}></div>}
    </header>
  );
};

export default Header;
