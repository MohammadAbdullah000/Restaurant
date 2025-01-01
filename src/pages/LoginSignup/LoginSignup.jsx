import React, { useState, useEffect,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../index.css";
import style from "./LoginSignup.module.css";
import { UserContext } from "../../Contexts/UserContext.jsx";
const LoginSignup = () => {
  const [inputStates, setInputStates] = useState({ mobile: false, password: false, email: false });
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [loginData, setLoginData] =  useState({ mobile: "", password: "" });
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(1);
  const navigate = useNavigate();


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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };
  const { setUser } = useContext(UserContext);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const response = await fetch("https://hotelbarkat.com/Apis/SigninApi.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          MobileNumber: loginData.mobile,
          Password: loginData.password,
        }).toString(),
      });

      const result = await response.json();
      // const result = await response.json();
      console.log("API Response:", result); // Debugging line
  
      // if (response.ok && result.status === "success") {
      if (result.id) {
        // Save user data if necessary (e.g., in localStorage or context)
        localStorage.setItem("user", JSON.stringify(result));
        // Navigate to the dashboard
        setUser({ full_name: result.full_name });
        navigate("/dashboard");
      } else {
        setError(result.message || "Invalid login credentials");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
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
          <form className={style.signInForm} onSubmit={handleLogin}>
            <div className={style.logo}>
              <img
                src="https://letzbim.com/wp-content/uploads/2020/06/jfjrtj.webp"
                alt="Logo"
              />
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
                  name="mobile"
                  value={loginData.mobile}
                  className={`${style.inputField} ${inputStates.mobile ? style.active : ""}`}
                  required
                  onFocus={() => handleFocus("mobile")}
                  onBlur={(e) => handleBlur("mobile", e.target.value)}
                  onChange={handleInputChange}
                />
                <label className={inputStates.mobile ? style.activeLabel : ""}>Mobile Number</label>
              </div>
              <div className={style.inputWrap}>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  className={`${style.inputField} ${inputStates.password ? style.active : ""}`}
                  required
                  onFocus={() => handleFocus("password")}
                  onBlur={(e) => handleBlur("password", e.target.value)}
                  onChange={handleInputChange}
                />
                <label className={inputStates.password ? style.activeLabel : ""}>Password</label>
              </div>
              <input type="submit" className={style.signBtn} value="Sign In" />
              {error && <p className={style.errorText}>{error}</p>}
              <Link to="/forgotpassword" className={style.text}>
                Forgotten your password?
              </Link>
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
