import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'
import { IoEyeOutline } from "react-icons/io5";

const LoginPage = () => {
  const port = process.env.REACT_APP_SECRET;

  const [isMobileView, setMobileView] = useState(false);
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
  const toggleForm = () => setIsSignup(!isSignup);
  const navigate = useNavigate();


  const [value, setValue] = useState({
    name: '',
    email: '',
    password: '',
  })

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
          alert(response.data.message);
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
        alert(response.data.message);
        if (response.data.role === 'Sadmin' || response.data.role === 'admin') {
          navigate('/dashboard');
        } else {
          localStorage.setItem("userType", selected);
          navigate('/');
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
          alert(response.data.message);
          return
        }
        // console.log(response.data);
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', response.data.role);
        const userInfo = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email
        }
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        alert(response.data.message);
        if (response.data.role === 'Sadmin' || response.data.role === 'admin') {
          navigate('/dashboard', { replace: true });
          setTimeout(() => {
            window.location.reload();
          }, 0);
        } else {
          navigate('/', { replace: true });
          setTimeout(() => {
            window.location.reload();
          }, 0);
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

  const [selected, setSelected] = useState("individual");


  return (
    <div className="container-fluid vh-100 p-0"
      style={{ backgroundImage: 'url(/Images/loginBg.jpg)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="d-flex align-items-center justify-content-end" style={{ height: "100vh" }}>
        <div className="bg-light" style={{ width: "100%", maxWidth: "40%", height: "100vh" }}>
          <div className="ps-5 pt-1 pe-2 d-flex flex-column align-items-start w-100 mt-4">
            <div className="d-flex align-items-start mb-1">
              <Link to='/'><img src="/Images/novibiz/icononly_transparent_nobuffer.png" alt="logo" style={{ width: "50px", height: "50px" }} /></Link>
            </div>
            <div className="d-flex flex-column align-items-start">
              <h2>Welcome!</h2>
              <label className="text-secondary">Enter your details below to sign <span>{isSignup ? 'up' : 'in'}</span></label>
            </div>


            <div className="w-75">
              <>
                <div className="d-flex align-items-start justify-content-between p-2 ps-4 pe-4 w-100 border rounded-5">
                  <div
                    className={'border rounded-5 p-2'}
                    style={{ cursor: "pointer", backgroundColor: selected === "individual" ? "tomato" : "", color: selected === "individual" ? "white" : "" }}
                    onClick={() => setSelected("individual")}
                  >
                    <strong onClick={() => setSelected('individual')}>As an individual</strong>
                  </div>

                  <div
                    className={'border rounded-5 p-2'}
                    style={{ cursor: "pointer", backgroundColor: selected === "company" ? "tomato" : "", color: selected === "company" ? "white" : "" }}
                    onClick={() => setSelected("company")}
                  >
                    <strong onClick={() => setSelected('company')}>As a company</strong>
                  </div>
                </div>
              </>
            </div>


            <form onSubmit={handleOnSubmit_up} className="w-100">
              <div className="d-flex flex-column align-items-start">
                {isSignup ? (
                  <>
                    <label className="text-secondary mt-2 mb-3 fs-4">Name<span className="text-danger">*</span></label>
                    <input type="text"
                      onChange={handleChange_up}
                      name="name"
                      placeholder={selected === 'individual' ? 'User Name' : 'Company Name'}
                      required
                      className="form-control w-100 mb-3" style={{ backgroundColor: "rgba(0, 52, 197, 0.21)" }} />
                  </>
                ) : (
                  <></>
                )}

                <label className={`text-secondary mb-3 fs-4 ${isSignup ? '' : 'mt-3'}`}>Email Address <span className="text-danger">*</span></label>
                <input type="email"
                  onChange={handleChange_up}
                  name="email"
                  placeholder={selected === 'individual' ? 'User Email' : 'Company Email'}
                  required
                  className="form-control w-100 mb-3" style={{ backgroundColor: "rgba(0, 52, 197, 0.21)" }} />

                <label className="text-secondary mb-3 fs-4">Password <span className="text-danger">*</span></label>
                <div className="d-flex flex-row w-100 mb-2">
                  <input
                    onChange={handleChange_up}
                    name="password"
                    placeholder="Password"
                    required
                    type={show} className="form-control" style={{ backgroundColor: "rgba(0, 52, 197, 0.21)" }} />
                  <span className="fs-4 p-1 rounded" onMouseDown={HidePassword} onMouseUp={ShwoPassword} style={{ backgroundColor: "rgba(0, 52, 197, 0.21)" }}>
                    <IoEyeOutline /></span>
                </div>
                <div className="d-flex flex-row w-100 mb-3 align-items-center">
                  <div className="d-flex flex-row w-50 justify-content-start">
                    <input type="checkbox" /><label className="ms-2 text-secondary">Remember Me</label>
                  </div>
                  <div className="d-flex w-50 flex-column align-items-end"><label className="text-primary">{isSignup ? "" : "Forget Your Password?"}</label></div>
                </div>
                <button type="submit" className="btn btn-primary w-100 fs-4 ">{isSignup ? "Sign Up" : "Sign In"}</button>
              </div>
            </form>
            <div className="w-100">
              <label className="fst-italic fs-6 mt-3">OR</label><br />
              <label className="fs-6 mt-2">{isSignup ? "Already have an account?" : "Don't have an account?"}{" "}<span className="text-primary" onClick={toggleForm}>{isSignup ? "Login" : "Sign Up"}</span></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;