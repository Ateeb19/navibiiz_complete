import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'
import { IoEyeOutline } from "react-icons/io5";
import { useAlert } from "../alert/Alert_message";

const LoginPage = () => {
  const port = process.env.REACT_APP_SECRET;
  const { showAlert } = useAlert();
  const [isMobileView, setMobileView] = useState(false);
  const [selected, setSelected] = useState("individual");


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
    handleResize(); // Initialize on component mount
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // console.log(isMobileView);

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
        console.log(response.data);
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
          navigate('/dashboard');
        } else {
          localStorage.setItem("userType", selected);
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath);
        }
      } catch (err) {
        console.log(err);
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
          showAlert(response.data.message);
          return
        }
        console.log(selected, 'from login');
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
          navigate('/dashboard', { replace: true });
        } else {
          localStorage.removeItem("redirectAfterLogin"); // Clear stored path
          navigate(redirectPath, { replace: true });
        }

      } catch (err) {
        console.log(err);
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
  console.log(isSignup);

  return (
    <div className="login-bg-wrapper">
      {/* {showAlert && <Alert message={alert_message} onClose={() => setShowAlert(false)} />} */}
      <div className="d-flex align-items-center justify-content-end" style={{ height: "100vh" }}>
        <div className="login-wrap">
          <div className="d-flex flex-column align-items-start">
            <div className="login-logo-wrap">
              <Link to='/'><img src="/Images/novibiz/icononly_transparent_nobuffer.png" alt="logo" /></Link>
            </div>
            <div className="d-flex flex-column align-items-start">
              <div className="title-head">
                <h2>Welcome!</h2>
              </div>
              <label className="text-secondary">Enter your details below to sign <span>{isSignup ? 'up' : 'in'}</span></label>
            </div>

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
                    <p onClick={() => setSelected('company')}>As a company</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleOnSubmit_up} className="w-100">
              <div className="d-flex flex-column align-items-start">
                {isSignup ? (
                  <>
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

                <label className={`input-label ${isSignup ? '' : ''}`}>Email Address <span className="text-danger">*</span></label>
                <input type="email"
                  onChange={handleChange_up}
                  name="email"
                  placeholder={selected === 'individual' ? 'Enter Your Email' : 'Company Email'}
                  required
                  className="input-field" />

                <label className="input-label">Password <span className="text-danger">*</span></label>
                <div className="d-flex flex-row w-100 mb-2">
                  <input
                    onChange={handleChange_up}
                    name="password"
                    placeholder="Password"
                    required
                    type={show}
                    className="input-field" />
                  <span className="fs-4 rounded" onMouseDown={HidePassword} onMouseUp={ShwoPassword} style={{ backgroundColor: "#ebebeb", padding: '12px 18px', height: '64px' }}>
                    <IoEyeOutline /></span>
                </div>
                <div className="d-flex flex-row w-100 mb-3 align-items-center">
                  <div className="d-flex flex-row w-50 justify-content-start">
                    <input type="checkbox" /><label className="ms-2 fs-6 text-secondary">Remember Me</label>
                  </div>
                  <div className="d-flex w-50 flex-column align-items-end"><label className="text-primary">{isSignup ? "" : "Forget Your Password?"}</label></div>
                </div>
                <button type="submit" className="btn-sign">{isSignup ? "Sign Up" : "Sign In"}</button>
              </div>
            </form>
            <div className="w-100">
              <label className="fst-italic fs-6 mt-3">OR</label><br />
              <label className="fs-6 mt-2" style={{ cursor: 'pointer' }}>{isSignup ? "Already have an account?" : "Don't have an account?"}{" "}<span className="text-primary" onClick={toggleForm}>{isSignup ? "Login" : "Sign Up"}</span></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;