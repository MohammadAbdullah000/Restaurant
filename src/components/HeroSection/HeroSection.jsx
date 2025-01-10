import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import { Link } from "react-scroll";
import style from './HeroSection.module.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner1 from '../../assests/6032930.jpg'
import banner2 from '../../assests/6032930.jpg'
import banner3 from '../../assests/6032930.jpg'
const HeroSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const settings = {
    dots: true,          // Show navigation dots
    infinite: true,      // Infinite scrolling
    speed: 500,          // Transition speed in ms
    slidesToShow: 1,     // Number of slides visible at a time
    slidesToScroll: 1,   // Number of slides to scroll at a time
    autoplay: true,      // Enable auto-scrolling
    autoplaySpeed: 3000, // Time between transitions (in ms)
    arrows: false,       // Disable next/prev arrows
  };

  return (
    <div className={style.hero}>
    <div className={style.over}></div>
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
            <li><Link to="/"> Home</Link></li>
            <li><Link to="about" smooth={true} duration={200}>About Us</Link></li>
            <li><Link to="contact">Contact Us</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </div>
      {/* Overlay for mobile */}
      {isOpen && <div className={style.overlay} onClick={toggleMenu}></div>}
    </header>

    <div className={`${style.herostart} ${style.cinzel500}`} >
    <div className={style.carouselContainer}>
    <Slider {...settings}>
      <div>
        <img src={banner1} alt="" className={style.carouselImage}/>
      </div>
      <div>
      <img src={banner2} alt="" className={style.carouselImage}/>

      </div>
      <div>
      <img src={banner3} alt="" className={style.carouselImage}/>

      </div>
      </Slider>
    </div>
     {/* <h1>Experience the Art of Fine Dining.</h1>
     <p>Delicious food for every mood!</p> */}
    </div>

    </div>
  );
};

export default HeroSection;
