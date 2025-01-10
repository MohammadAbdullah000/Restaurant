import React from 'react'
import style from './ContactUs.module.css'

const ContactUs = () => {
  return (
    <div id='contact'>
      <div className={`${style.contactus} ${style.nunito500}`}>
        <h2>Contact Us</h2>
        <div className={style.contactcontent}>

          <div className={style.contact}>
            <h4>Contact</h4>
            <p>info@youraddress.com</p>
            <p>646-675-5974</p>
          </div>
          <div className={style.contact}>
            <h4>Location</h4>
            <p>Nagpur</p>
            <p>Mahashtra</p>
          </div>
          <div className={style.contact}>
            <h4>Open hours</h4>
            <p>Monday to Friday</p>
            <p>9:00 am - 7:30 pm</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs