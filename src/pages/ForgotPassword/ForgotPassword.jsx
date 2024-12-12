import React, { useState, useEffect } from "react";
import "../../index.css";
import { Link } from "react-router-dom";
import style from "./ForgotPassword.module.css";
import { useRef } from "react";
const ForgotPassword = () => {
  const [inputStates, setInputStates] = useState({ name: false, password: false, email: false });
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [activeSlide, setActiveSlide] = useState(1);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger the fade-in animation when the component mounts
    setFadeIn(true);
  }, []);

  const handleFocus = (field) => {
    setInputStates((prevState) => ({ ...prevState, [field]: true }));
  };

  const handleBlur = (field, value) => {
    setInputStates((prevState) => ({ ...prevState, [field]: value !== "" }));
  };

  const toggleMode = () => {
    setIsSignUpMode((prevMode) => !prevMode);
  };

  const moveSlider = (index) => {
    setActiveSlide(index);
  };


  const inputsRef = useRef([]);
  const [step, setStep] = useState(1); 
  // Handle input value and focus transition
  const handleInputChange = (e, index) => {
    const { value } = e.target;

    // Only allow single numeric values
    if (!/^\d$/.test(value) && value !== "") {
      e.target.value = "";
      return;
    }

    // Move focus to the next input if the value is valid
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace key for navigating backward
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };
  return (
    <div
      className={`${style.login} ${isSignUpMode ? style.signUpMode : ""} ${
        fadeIn ? style.fadeIn : ""
      }`}
    >
      <div className={`${style.box} ${style.form} ${style.nunito500}`}>
        <div className={style.innerBox}>
          <div className={style.formsWrap}>
            {/* Sign In Form */}
            {step === 1 && (
              <form className={style.signInForm}>
                <div className={style.heading}>
                  <h2 className={style.cinzel500}>Forgot Password</h2>
                </div>
                <div className={style.actualForm}>
                  <div className={style.inputWrap}>
                    <input
                      type="email"
                      className={style.inputField}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <Link
                    to="#"
                    className={`${style.toggle} ${style.getotp}`}
                    onClick={() => setStep(2)} // Move to Step 2
                  >
                    Get OTP
                  </Link>
                </div>
              </form>
            )}

            {/* Show OTP Input and Submit Button */}
            {step === 2 && (
              <form className={style.signInForm}>
              
                <div className={style.heading}>
                  <h2 className={style.cinzel500}>Enter the OTP</h2>
                  <h4>We have sent to</h4>
                  <span>ejaz8837@gmail.com</span>
                </div>
                <div className={style.actualFormotp}>
                  {[...Array(4)].map((_, index) => (
                    <div className={style.inputWrapotp} key={index}>
                      <input
                        type="text"
                        className={style.inputFieldotp}
                        maxLength="1"
                        ref={(el) => (inputsRef.current[index] = el)} // Assign ref to each input
                        onChange={(e) => handleInputChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    </div>
                  ))}
                </div>
                <Link to="#" className={`${style.toggle} ${style.getotp}`} onClick={toggleMode}>
                  Submit
                </Link>
              </form>
            )}

            {/* Sign Up Form */}
            <form action="" className={style.signUpForm}>
              <div className={style.logo}>
                {/* <p>Logo</p> */}
                <Link to="#" className={`${style.toggle} ${style.backbtn}`} onClick={toggleMode}>
                  Back
                </Link>
              </div>
              <div className={style.heading}>
                {/* <Link to="#" className={`${style.toggle} ${style.backbtn}`} onClick={toggleMode}>
                  Back
                </Link> */}
                <h2 className={style.cinzel500}>Enter New Password</h2>
                {/* <h6>Already have an account? </h6> */}
              </div>
              <div className={style.actualForm}>
                <div className={style.inputWrap}>
                  <input
                    type="text"
                    className={`${style.inputField} ${inputStates.name ? style.active : ""}`}
                    required
                    // onFocus={() => handleFocus("name")}
                    // onBlur={(e) => handleBlur("name", e.target.value)}
                  />
                  {/* <label className={inputStates.name ? style.activeLabel : ""}>Name</label> */}
                </div>
                <Link to="#" className={`${style.toggle} ${style.getotp}`} >
                  Confirm
                </Link>
                
                {/* <input type="submit" className={style.signBtn} value="Sign Up" /> */}
                {/* <Link to="#" className={style.toggle} onClick={toggleMode}>
                  Sign Up
                </Link> */}
                {/* <p className={style.text}>Agree to Terms and Conditions</p> */}
              </div>
            </form>
          </div>

          {/* Image Carousel */}
          <div className={style.carousel}>
            <div className={style.imagesWrapper}>
              {[1, 2, 3].map((index) => (
                <img
                  key={index}
                  src={`../src/assets/img${index}.jpg`}
                  className={`${style.image}  ${index === activeSlide ? style.show : ""}`}
                  id="img-`${index}`"
                  alt={`Slide ${index}`}
                />
              ))}
            </div>
            <div className={style.bullets}>
              {[1, 2, 3].map((index) => (
                <span
                  key={index}
                  className={index === activeSlide ? style.active : ""}
                  onClick={() => moveSlider(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
