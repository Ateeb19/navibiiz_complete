import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSendFill } from "react-icons/bs";
import { MdDashboardCustomize } from "react-icons/md";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { FaBell } from "react-icons/fa"
import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io"
import { useAlert } from "../alert/Alert_message";
import { useTranslation } from "react-i18next";
import Translater from "./Translater";


const Navbar = () => {
  const userRole = localStorage.getItem('userRole');
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const token = localStorage.getItem('token');
  const port = process.env.REACT_APP_SECRET;
  const navigate = useNavigate();
  const isRedirecting = useRef(false);

  useEffect(() => {
    const fetchToken = () => {
      axios
        .get(`${port}/user/check_token`, {
          headers: {
            Authorization: token,
          },
        }).then((response) => {
          if (response.data.status === false) {
            localStorage.removeItem('token');
          }
          if (response.data.status === true) {
            localStorage.setItem('userRole', response.data.message);
          }
        }).catch((err) => {
          if (token) {
            if (err.response && err.response.status === 403 && !isRedirecting.current) {
              isRedirecting.current = true;
              localStorage.removeItem('token');
              showAlert('Token expired. Please login again.');
            } else {
              console.error("Unexpected error:", err);
            }
          }
        });
    };
    const userType = localStorage.getItem("userType");
    if (userType === "company") {
      setIsVisible(true);
    }
    fetchToken();
  }, [token]);

  const [userInfo, setUserInfo] = useState('');
  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'Sadmin' && userRole !== 'user') {
    } else {
      axios.get(`${port}/user/display_profile`, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        setUserInfo(response.data.message);
      }).catch((err) => {
        if (err.response && err.response.status === 403 && !isRedirecting.current) {
          isRedirecting.current = true;
          localStorage.removeItem('token');
          showAlert('Token expired. Please login again.');
        } else {
          console.error("Unexpected error:", err);
        }
      });
    }
  }, [userRole]);

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {

    const interval = setInterval(() => {
      const storedValue = localStorage.getItem("isVisible");
      if (storedValue === "true") {
        setIsVisible(true);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("userType", '');
    localStorage.setItem("isVisible", "false");
  }
  const location = useLocation();
  const navStyle = {
    backgroundColor: location.pathname === '/dashboard' ? ' #00232f' : ' #012A52',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1050,
  };

  return (
    <div className="container-fluid">
      <nav className="d-flex justify-content-between align-items-center w-100 px-3 py-2"
        style={navStyle}>

        <div className="d-flex justify-content-start align-items-center ms-3">
          <Link to="/" style={{ textDecoration: "none" }} >
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                width: "150px",
                height: "80px",
              }}
            >
              <img
                src="/Images/novibiz/fulllogo_transparent_nobuffer.png"
                alt="logo"
                className="img-fluid"
                style={{ maxHeight: "100%", objectFit: "contain" }}
              />
            </div>
          </Link>
        </div>




        <div className="d-lg-none">
          <button className="btn text-light" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
          </button>
        </div>

        <div className="d-none d-lg-flex justify-content-end align-items-center gap-4 flex-grow-1 me-4">
          {/* <Translater /> */}
          <Link to="/" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: '500' }} >Home</Link>
          <Link to="/about_us" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: '500' }} >{t("about_us")}</Link>
          <Link to="/transporters_list" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: '500' }} >Transporters</Link>
          <Link to="/offers" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: '500' }} >Shipments</Link>
        </div>

        <div className="d-none d-lg-flex justify-content-end align-items-center gap-2">
          {((!token || token.length === 0) || (userInfo && userInfo.role === 'Sadmin')) && (
            <Link to="/register_company" >
              <button className="btn m-1" style={{ fontSize: "16px", backgroundColor: " #FFFFFF", color: '#012A52', fontWeight: '500' }}>
                {(userInfo && userInfo.role === 'Sadmin') ? (
                  <span><IoIosAddCircleOutline className="fs-4" /> Add New Transporter</span>
                ) : (
                  'Register Transporter'
                )}
              </button>
            </Link>
          )}
          {token ? (
            <>
              <Link to="/send_groupage" >
                <button className="btn m-1" style={{ backgroundColor: "#FFFFFF", color: '#012A52', fontWeight: '500' }}>
                  <BsSendFill /> <span style={{ fontSize: "16px" }}>Send Groupage</span>
                </button>
              </Link>

              <FaBell className="fs-3 me-3 ms-3" style={{ color: ' #fff' }} onClick={() => { navigate('/notification') }} />
              {(userRole === "admin" || userRole === "Sadmin" || userRole === 'user') && (
                <Link to="/dashboard" >
                  <button className="btn btn-light m-1" style={{ fontSize: "16px", color: "#012A52" }}>
                    <MdDashboardCustomize />
                  </button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/send_groupage" >
                <button className="btn m-1" style={{ fontSize: "16px", backgroundColor: "#FFFFFF", color: '#012A52', fontWeight: '500' }}>
                  <BsSendFill /> Send Groupage
                </button>
              </Link>
              <Link to="/login" >
                <button className="btn btn-light m-1" style={{ fontSize: "16px", color: "#012A52", fontWeight: '500' }}>
                  <FaUser /> Login
                </button>
              </Link>
            </>
          )}

        </div>

        {isOpen && (
          <div className="d-flex justify-content-end position-fixed top-0 end-0 ps-3 pe-3 rounded-4 shadow-lg"
            style={{ zIndex: 1050, paddingTop: "30px", backgroundColor: " #012A52" }}>

            <button className="btn position-absolute text-light top-2 end-2" onClick={() => { setIsOpen(false) }}>
              <FaTimes size={30} />
            </button>

            <div className="d-flex flex-column text-center py-4 text-light">
              <Link to="/" className="text-light text-decoration-none" style={{ fontSize: "1rem" }} >Home</Link>
              <Link to="/about_us" className="py-3 text-light text-decoration-none" onClick={() => { setIsOpen(false) }}>About Us</Link>
              <Link to="/transporters_list" className="py-3 text-light text-decoration-none" onClick={() => { setIsOpen(false) }}>Transporters</Link>
              <Link to="/offers" className="py-3 text-light text-decoration-none" onClick={() => { setIsOpen(false) }}>Shipments</Link>
              {((!token || token.length === 0) || (userInfo && userInfo.role === 'Sadmin')) && (
                <Link to="/register_company" >
                  <button className="btn m-1" style={{ fontSize: "1rem", backgroundColor: "#FFFFFF" }}>
                    {(userInfo && userInfo.role === 'Sadmin') ? (
                      <span><IoIosAddCircleOutline /> Add New Transporter</span>
                    ) : (
                      'Register Transporter'
                    )}
                  </button>
                </Link>
              )}
              {token ? (
                <>
                  <Link to="/send_groupage" className="py-2">
                    <button className="btn w-100" style={{ fontSize: "1rem", backgroundColor: "#FFFFFF", color: '#012A52' }}>
                      <BsSendFill /> Send Groupage
                    </button>
                  </Link>
                  <FaBell className="fs-3 me-3 ms-3" style={{ color: ' #fff' }} onClick={() => { navigate('/notification') }} />
                  {(userRole === "admin" || userRole === "Sadmin" || userRole === 'user') && (
                    <Link to="/dashboard" >
                      <button className="btn btn-light w-100 mt-2" style={{ fontSize: "1rem", color: "#012A52" }}>
                        <MdDashboardCustomize />
                      </button>
                    </Link>
                  )}
                </>
              ) : (
                <>

                  <Link to="/send_groupage" >
                    <button className="btn w-100 mt-2" style={{ fontSize: "1rem", backgroundColor: "#FFFFFF", color: '#012A52' }}>
                      <BsSendFill /> Send Groupage
                    </button>
                  </Link>
                  <FaBell className="fs-3 me-3 ms-3" style={{ color: ' #fff' }} onClick={() => { navigate('/notification') }} />
                  <Link to="/login" >
                    <button className="btn btn-light w-100 mt-2" style={{ fontSize: "1rem", color: "#012A52" }}>
                      <FaUser /> Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav >
    </div>
  )
}

export default Navbar;