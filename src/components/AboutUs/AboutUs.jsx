import React from 'react'
import style from './AboutUs.module.css'
const AboutUs = () => {
  return (
    <div id='about' className={`${style.about} ${style.nunito500}`}>
    <div className={style.wrapper}>

    <div className={style.left}>
      <div className={style.title}>About Us</div>
    </div>
      <div className={style.line}></div>
      <div className={style.right}>
          <p>"At Hotel Barkat, we blend tradition and innovation to create unforgettable culinary experiences. From locally-sourced ingredients to globally-inspired recipes, we craft each dish with passion and precision."</p>
      </div>
    </div>
    </div>
  )
}

export default AboutUs  