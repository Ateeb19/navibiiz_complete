import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline } from "react-icons/io5";
import { useAlert } from "../alert/Alert_message";
import { IoMdArrowRoundBack } from "react-icons/io";
import '../../assets/css/responsive.css'
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
const LoginPage = () => {
  const port = process.env.REACT_APP_SECRET;
  const { showAlert } = useAlert();
  const [isMobileView, setMobileView] = useState(false);
  const [selected, setSelected] = useState("individual");
  const [rememberMe, setRememberMe] = useState(false);
  const [forget_password, setForget_password] = useState(false);
  const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";

  useEffect(() => {
    setInterval(() => {
      if (selected === 'company' || isSignup === 'true') {
        navigate('/register_company');
      }
    }, 100);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isSignup, setIsSignup] = useState(false);
  const toggleForm = () => {

    if (selected === 'company' || isSignup === 'true') {
      navigate('/register_company');
    }
    setIsSignup(!isSignup);

  }
  const navigate = useNavigate();


  const [value, setValue] = useState({
    name: '',
    email: '',
    password: '',
    user_type: 'individual',
    rememberMe: rememberMe,
  })
  useEffect(() => {
    setValue((prev) => ({ ...prev, user_type: selected }));
  }, [selected]);

  const handleChange_up = (e) => {
    setValue(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleOnSubmit_up = async (evt) => {

    if (isSignup) {

      evt.preventDefault();
      let response = '';
      try {
        response = await axios.post(`${port}/user/regester`, value, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.data.status) {
          showAlert(response.data.message);
          return
        }
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', response.data.role);
        const userInfo = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email
        }
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        showAlert(response.data.message);
        if (response.data.role === 'Sadmin' || response.data.role === 'admin') {
          if (redirectPath) {
            localStorage.removeItem("redirectAfterLogin");
            navigate(redirectPath, { replace: true });
            return;
          }
          navigate('/dashboard');
        } else {
          localStorage.setItem("userType", selected);
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath);
        }
      } catch (err) {
        showAlert('You are Offline! Please Connect to Internet');
      }
    } else {
      evt.preventDefault();
      let response = '';
      try {
        response = await axios.post(`${port}/user/login`, value, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.data.status) {
          if (!response.data.type) {
            showAlert(response.data.message);
            return
          }
          if (response.data.type === 'individual') {
            showAlert("Login as a transporter");
          } else {
            showAlert("Login as an individual");
          }
          return
        }
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', response.data.role);
        const userInfo = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email
        }
        localStorage.setItem('user_logins_type', selected)
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        showAlert(response.data.message);
        if (response.data.role === 'Sadmin' || response.data.role === 'admin') {
          if (redirectPath) {
            localStorage.removeItem("redirectAfterLogin");
            navigate(redirectPath, { replace: true });
            return;
          }
          navigate('/dashboard', { replace: true });
        } else {
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath, { replace: true });
        }

      } catch (err) {
        showAlert('You are Offline! Please Connect to Internet');
      }
    }
  };

  const [show, setShow] = useState('password');
  const HidePassword = () => {
    setShow('text');
  }
  const ShwoPassword = () => {
    setShow('password');
  }

  const handle_forget_password = () => {
    setForget_password(!forget_password);
  }

  const handle_submit_forget_password = async (evt) => {
    evt.preventDefault();

    const email = value.email;

    if (email === '') {
      showAlert('Please enter your email address!');
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      showAlert('Please enter a valid email address!');
      return;
    }
    try {
      const res = await axios.post(`${port}/user/forget_password`, {
        email,
      });

      showAlert(res.data.message);
    } catch (error) {
      showAlert('You are Offline! Please Connect to Internet');
    }
  }


  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // user contains verified data from Google
      const res = await axios.post(
        `${port}/user/google-login`,
        {
          name: user.displayName,
          email: user.email,
          picture: user.photoURL,
        }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-bg-wrapper">
      <div className="d-flex align-items-center justify-content-center justify-content-md-end" style={{ minHeight: "100vh" }}>
        <div className="login-wrap">
          <div className="d-flex flex-column align-items-start">
            <div className="login-logo-wrap">
              <Link to='/'><img src="/Images/novibiz/icononly_transparent_nobuffer.png" alt="logo" /></Link>
            </div>
            <div className="d-flex flex-column align-items-start">
              <div className="title-head">
                <h2> {forget_password ? ` Forget Your Password!` : `Welcome!`}</h2>
              </div>
              <label className="text-secondary">{forget_password ? `Please enter your email address` : `Enter your details below to sign ${isSignup ? 'up' : 'in'}`}</label>
            </div>

            {!forget_password && (
              <>
                <div className="login-tab-wrapper">
                  <div className="login-tab-wrap">
                    <div className="d-flex align-items-start justify-content-between p-2 ps-3 pe-3 w-100 border rounded-5">
                      <div
                        className={'tab-btn'}
                        style={{ cursor: "pointer", backgroundColor: selected === "individual" ? "#de8316" : "", color: selected === "individual" ? "white" : "" }}
                        onClick={() => setSelected("individual")}
                      >
                        <p onClick={() => setSelected('individual')}>As an individual</p>
                      </div>

                      <div
                        className={'tab-btn'}
                        style={{ cursor: "pointer", backgroundColor: selected === "company" ? "#de8316" : "", color: selected === "company" ? "white" : "" }}
                        onClick={() => { setSelected('company'); if (isSignup) { navigate('/register_company') } }}
                      >
                        <p onClick={() => setSelected('company')}>As a Transporter</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {forget_password && (
              <>
                <div className="login-tab-wrapper">
                  <div className="d-flex align-items-start justify-content-start">
                    <div className="title-head" style={{ cursor: 'pointer' }} onClick={() => setForget_password(false)}>
                      <h3><IoMdArrowRoundBack className="mt-1" /> Back</h3>
                    </div>
                  </div>
                </div>
              </>
            )}

            <form onSubmit={handleOnSubmit_up} className="w-100">
              <div className="d-flex flex-column align-items-start">
                {isSignup ? (
                  <>
                    {selected === 'individual' && (
                      <button onClick={handleGoogleLogin} className="login-google-btn mb-3 mt-1">
                        <FcGoogle className="fs-4 pb-1" /> Continue with Google
                      </button>
                    )}
                    <label className="input-label">Name<span className="text-danger">*</span></label>
                    <input type="text"
                      onChange={handleChange_up}
                      name="name"
                      placeholder={selected === 'individual' ? 'Enter Your Name' : 'Company Name'}
                      required
                      className="input-field" />
                  </>
                ) : (
                  <></>
                )}
                {(selected === 'individual' && !isSignup )&& (
                  <button onClick={handleGoogleLogin} className="login-google-btn mb-3 mt-1">
                    <FcGoogle className="fs-4 pb-1" /> Continue with Google
                  </button>
                )}
                <label className={`input-label ${isSignup ? '' : ''}`}>Email Address <span className="text-danger">*</span></label>
                <input type="email"
                  onChange={handleChange_up}
                  name="email"
                  placeholder={selected === 'individual' ? 'Enter Your Email' : 'Company Email'}
                  required
                  className="input-field" />

                {!forget_password && (
                  <>
                    <label className="input-label">Password <span className="text-danger">*</span></label>
                    <div className="d-flex flex-row w-100 mb-2">
                      <input
                        onChange={handleChange_up}
                        name="password"
                        placeholder="Password"
                        required
                        type={show}
                        className="input-field" />
                      <span className="fs-4 rounded" onMouseDown={HidePassword} onMouseUp={ShwoPassword} style={{ backgroundColor: "#ebebeb", padding: '12px 18px', height: '54px' }}>
                        <IoEyeOutline /></span>
                    </div>
                  </>
                )}


                <div className="d-flex flex-row w-100 mb-3 align-items-center text-start gap-3">
                  <div className="d-flex flex-row w-50 justify-content-start">
                    {!forget_password && (
                      <>
                        <input type="checkbox" checked={rememberMe}
                          onChange={(e) => {
                            setRememberMe(e.target.checked);
                            setValue(prev => ({ ...prev, rememberMe: e.target.checked }));
                          }} />
                        <label className="ms-2 fs-6 text-secondary">Remember Me</label>
                      </>
                    )}
                  </div>
                  <div className="d-flex w-50 flex-column align-items-end"><label className="text-primary" onClick={handle_forget_password}>{isSignup ? "" : "Forget Your Password?"}</label></div>
                </div>
                {forget_password ? (
                  <>
                    <button onClick={handle_submit_forget_password} className="btn-sign">Continue</button>
                  </>
                ) : (
                  <>
                    <button type="submit" className="btn-sign">{isSignup ? "Sign Up" : "Sign In"}</button>
                  </>
                )}
              </div>
            </form>
            <div className="w-100">
              {!forget_password && (
                <>
                  <label className="fst-italic fs-6 mt-3">OR</label><br />
                  <label className="fs-6 mt-2" style={{ cursor: 'pointer' }}>{isSignup ? "Already have an account?" : "Don't have an account?"}{" "}<span className="text-primary" onClick={toggleForm}>{isSignup ? "Login" : "Sign Up"}</span></label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;