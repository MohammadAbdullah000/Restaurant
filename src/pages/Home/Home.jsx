import React from 'react'
import Header from '../../layouts/Header/Header'
import HeroSection from '../../components/HeroSection/HeroSection'
import AboutUs from '../../components/AboutUs/AboutUs'
import Slider from '../../components/Slider/Slider'
import ContactUs from '../../components/ContactUs/ContactUs'
import Footer from '../../layouts/Footer/Footer'
const Home = () => {
  return (
    <div>
        {/* <Header/> */}
        <HeroSection/>
        <AboutUs />
        <Slider/>
        <ContactUs/>
        <Footer/>

    </div>
  )
}

export default Home