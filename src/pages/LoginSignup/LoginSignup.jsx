import React, { useState, useEffect } from "react";
import "../../index.css";
import { Link } from "react-router-dom";
import style from "./LoginSignup.module.css";

const LoginSignup = () => {
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

  return (
    <div
      className={`${style.login} ${isSignUpMode ? style.signUpMode : ""} ${
        fadeIn ? style.fadeIn : ""
      }`}
    >
      <div className={`${style.box} ${style.nunito500}`}>
        <div className={style.innerBox}>
          <div className={style.formsWrap}>
            {/* Sign In Form */}
            <form action="" className={style.signInForm}>
              <div className={style.logo}>
                                <img src="https://letzbim.com/wp-content/uploads/2020/06/jfjrtj.webp"  alt="" />

              </div>
              <div className={style.heading}>
                <h2 className={style.cinzel500}>Welcome Back</h2>
                <h6>Not registered yet? </h6>
                <Link to="#" className={style.toggle} onClick={toggleMode}>
                  Sign Up
                </Link>
              </div>
              <div className={style.actualForm}>
                <div className={style.inputWrap}>
                  <input
                    type="text"
                    className={`${style.inputField} ${inputStates.name ? style.active : ""}`}
                    required
                    onFocus={() => handleFocus("name")}
                    onBlur={(e) => handleBlur("name", e.target.value)}
                  />
                  <label className={inputStates.name ? style.activeLabel : ""}>Name</label>
                </div>
                <div className={style.inputWrap}>
                  <input
                    type="password"
                    className={`${style.inputField} ${inputStates.password ? style.active : ""}`}
                    required
                    onFocus={() => handleFocus("password")}
                    onBlur={(e) => handleBlur("password", e.target.value)}
                  />
                  <label className={inputStates.password ? style.activeLabel : ""}>Password</label>
                </div>
                <input type="submit" className={style.signBtn} />
                <Link to='/forgotpassword' className={style.text}>Forgotten your password?</Link>
              </div>
              
            </form>

            {/* Sign Up Form */}
            <form action="" className={style.signUpForm}>
              <div className={style.logo}>
                <img src="https://letzbim.com/wp-content/uploads/2020/06/jfjrtj.webp" alt="" />
              </div>
              <div className={style.heading}>
                <h2 className={style.cinzel500}>Get Started</h2>
                <h6>Already have an account? </h6>
                <Link to="#" className={style.toggle} onClick={toggleMode}>
                  Sign In
                </Link>
              </div>
              <div className={style.actualForm}>
                <div className={style.inputWrap}>
                  <input
                    type="text"
                    className={`${style.inputField} ${inputStates.name ? style.active : ""}`}
                    required
                    onFocus={() => handleFocus("name")}
                    onBlur={(e) => handleBlur("name", e.target.value)}
                  />
                  <label className={inputStates.name ? style.activeLabel : ""}>Name</label>
                </div>
                <div className={style.inputWrap}>
                  <input
                    type="email"
                    className={`${style.inputField} ${inputStates.email ? style.active : ""}`}
                    required
                    onFocus={() => handleFocus("email")}
                    onBlur={(e) => handleBlur("email", e.target.value)}
                  />
                  <label className={inputStates.email ? style.activeLabel : ""}>Email</label>
                </div>
                <div className={style.inputWrap}>
                  <input
                    type="password"
                    className={`${style.inputField} ${inputStates.password ? style.active : ""}`}
                    required
                    onFocus={() => handleFocus("password")}
                    onBlur={(e) => handleBlur("password", e.target.value)}
                  />
                  <label className={inputStates.password ? style.activeLabel : ""}>Password</label>
                </div>
                <input type="submit" className={style.signBtn} value="Sign Up" />
                <p className={style.text}>Agree to Terms and Conditions</p>
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

export default LoginSignup;
