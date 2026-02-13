import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSendFill } from "react-icons/bs";
import { MdDashboardCustomize } from "react-icons/md";
import { FaUser, FaBars, FaTimes, FaBoxOpen } from "react-icons/fa";
import { FaBell } from "react-icons/fa"
import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io"
import { useAlert } from "../alert/Alert_message";
import { useTranslation } from "react-i18next";
import Translater from "./Translater";
import { HiMiniRectangleStack } from "react-icons/hi2";

const Navbar = () => {
  const userRole = localStorage.getItem('userRole');
  const location = useLocation();
  const { t } = useTranslation();
  const { showAlert } = useAlert();
  const token = localStorage.getItem('token');
  const port = process.env.REACT_APP_SECRET;
  const navigate = useNavigate();
  const isRedirecting = useRef(false);
  const [open, setOpen] = useState(false);
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

  const [bell, setBell] = useState(false);
  const [notification_count, setNotification_count] = useState();
  const fetch_bell = () => {
    axios.get(`${port}/notification/notification_bell`, {
      headers: {
        Authorization: token,
      }
    }).then((res) => {
      if (res.data.status === true) {
        if (res.data.message > 0) {
          setBell(true);
          setNotification_count(res.data.message);
        } else {
          setBell(false);
        }
      } else {
        setBell(false);
      }
    }).catch((err) => {
      console.log('No notification !');
    })
  }

  useEffect(() => {
    fetch_bell();
  }, [location.pathname])


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
  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const navStyle = {
    backgroundColor: isDashboardRoute ? ' #00232f' : ' #012A52',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1050,
  };
  const nav_drop_down = {
    backgroundColor: isDashboardRoute ? ' #00232f' : ' #012A52',
  }

  const toggleMenu = () => {
    setOpen(prev => !prev);
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




        <div className="d-lg-none d-flex">
          {!token ? (<div>
            <Link to="/login" >
              <button className="btn btn-light w-100 mt-2" style={{ fontSize: "1rem", color: "#012A52" }}>
                <FaUser /> Login
              </button>
            </Link>
          </div>
          ) : (
            <div className="d-flex gap-4 align-items-center justify-content-center me-3">
              {/* <FaBell className="fs-3 " style={{ color: ' #fff' }} onClick={() => { navigate('/dashboard/notification') }} /> */}
              <div style={{ position: "relative", display: "inline-block" }}>
                <FaBell
                  className="fs-3 me-3 ms-3"
                  style={{ color: "#fff", cursor: "pointer" }}
                  onClick={() => navigate('/dashboard/notification')}
                />

                {bell && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "0px",
                      right: "6px",
                      minWidth: "20px",
                      height: "20px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: "bold",
                      padding: "2px"
                    }}
                  >
                    {notification_count}
                  </span>
                )}
              </div>
              {(userRole === "admin" || userRole === "Sadmin" || userRole === 'user') && (
                <Link to="/dashboard" >
                  <MdDashboardCustomize className="fs-1" style={{ color: ' #fff' }} />
                </Link>
              )}
            </div>
          )}

          <button className="btn text-light" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
          </button>
        </div>



        <div className="d-none d-lg-flex justify-content-end align-items-center gap-4 flex-grow-1 me-4">
          {/* <Translater /> */}
          <Link to="/" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: '500' }} >Home</Link>
          <Link to="/how-it-works" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: '500' }} >How it Works</Link>
          <Link to="/shipments" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: '500' }} >Shipments</Link>
          {/* <Link to="/about_us" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: '500' }} >{t("about_us")}</Link> */}
          <Link to="/about_us" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: '500' }} >About</Link>
          <Link to="/contact_us" className="text-light text-decoration-none" style={{ fontSize: "16px", fontWeight: '500' }} >Contact Us</Link>
        </div>

        {token ? (
          <div className="d-none d-lg-block">
            {userRole === 'admin' ? null : (<>
              <div className="d-flex flex-column align-items-start justify-content-start"
                onMouseEnter={() => { if (userRole === 'admin') return; setOpen(true) }}
                onMouseLeave={() => { if (userRole === 'admin') return; setOpen(false) }}
                onClick={() => { if (userRole === 'admin') return; setOpen(!open) }}
              >
                <button
                  className="btn m-1"
                  style={{ backgroundColor: "#FFFFFF", color: '#012A52', fontWeight: '500' }}
                  onClick={() => { if (userRole === 'admin') navigate('/shipments'); else toggleMenu() }}
                >
                  <BsSendFill /> <span style={{ fontSize: "16px" }}>Send {userRole === 'admin' ? 'Shipments' : 'Groupage'}</span>
                </button>

                {open && (
                  <div className="dropdown-menu dropdown-menu-navbar d-flex flex-column align-items-center justify-content-center gap-1 text-start" style={nav_drop_down}>
                    <button onClick={() => { navigate('/send_groupage/item'); setOpen(false); }} className="btn groupage-btn"> <HiMiniRectangleStack className="fs-5 me-1" /> Send Items</button>
                    <button onClick={() => { navigate('/send_groupage/box'); setOpen(false); }} className="btn groupage-btn"><FaBoxOpen className="fs-5 me-1" /> Send Boxes</button>
                  </div>
                )}
              </div>
            </>)}
          </div>
        ) : (
          <>

          </>
        )}
        {!token && (
          <div className="d-none d-lg-block">
            {userRole === 'admin' ? null : (<>
              <div className="d-flex flex-column align-items-start justify-content-start"
                onMouseEnter={() => { if (userRole === 'admin') return; setOpen(true) }}
                onMouseLeave={() => { if (userRole === 'admin') return; setOpen(false) }}
                onClick={() => { if (userRole === 'admin') return; setOpen(!open) }}
              >
                <button
                  className="btn m-1"
                  style={{ backgroundColor: "#FFFFFF", color: '#012A52', fontWeight: '500' }}
                  onClick={() => { if (userRole === 'admin') navigate('/shipments'); else toggleMenu() }}
                >
                  <BsSendFill /> <span style={{ fontSize: "16px" }}>Send {userRole === 'admin' ? 'Shipments' : 'Groupage'}</span>
                </button>

                {open && (
                  <div className="dropdown-menu dropdown-menu-navbar  d-flex flex-column align-items-center justify-content-center gap-1 text-start" style={nav_drop_down}>
                    <button onClick={() => { navigate('/send_groupage/item'); setOpen(false); }} className="btn groupage-btn"> <HiMiniRectangleStack className="fs-5 me-1" /> Send Items</button>
                    <button onClick={() => { navigate('/send_groupage/box'); setOpen(false); }} className="btn groupage-btn"><FaBoxOpen className="fs-5 me-1" /> Send Boxes</button>
                  </div>
                )}
              </div>
            </>)}
          </div>
        )}

        <div className="d-none d-lg-flex justify-content-end align-items-center gap-2 ms-2">
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
              {/* <Link to="/send_groupage" > */}
              {/* {userRole === 'admin' ? null : (<>
                <div className="d-flex flex-column align-items-start justify-content-start"
                  onMouseEnter={() => { if (userRole === 'admin') return; setOpen(true) }}
                  onMouseLeave={() => { if (userRole === 'admin') return; setOpen(false) }}
                  onClick={() => { if (userRole === 'admin') return; setOpen(!open) }}
                >
                  <button
                    className="btn m-1"
                    style={{ backgroundColor: "#FFFFFF", color: '#012A52', fontWeight: '500' }}
                    onClick={() => { if (userRole === 'admin') navigate('/shipments'); else toggleMenu() }}
                  >
                    <BsSendFill /> <span style={{ fontSize: "16px" }}>Send {userRole === 'admin' ? 'Shipments' : 'Groupage'}</span>
                  </button>

                  {open && (
                    <div className="dropdown-menu dropdown-menu-navbar d-flex flex-column align-items-center justify-content-center gap-1 text-start" style={nav_drop_down}>
                      <button onClick={() => { navigate('/send_groupage/item'); setOpen(false); }} className="btn groupage-btn"> <HiMiniRectangleStack className="fs-5 me-1" /> Send Items</button>
                      <button onClick={() => { navigate('/send_groupage/box'); setOpen(false); }} className="btn groupage-btn"><FaBoxOpen className="fs-5 me-1" /> Send Boxes</button>
                    </div>
                  )}
                </div>
              </>)} */}

              {/* </Link> */}
              <div style={{ position: "relative", display: "inline-block" }}>
                <FaBell
                  className="fs-3 me-3 ms-3"
                  style={{ color: "#fff", cursor: "pointer" }}
                  onClick={() => navigate('/dashboard/notification')}
                />

                {bell && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "0px",
                      right: "6px",
                      minWidth: "20px",
                      height: "20px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: "bold",
                      padding: "2px"
                    }}
                  >
                    {notification_count}
                  </span>
                )}
              </div>


              {/* <FaBell className="fs-3 me-3 ms-3" style={{ color: ' #fff' }} onClick={() => { navigate('/dashboard/notification') }} /> */}
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
              {/* <Link to="/send_groupage" >
                <button className="btn m-1" style={{ fontSize: "16px", backgroundColor: "#FFFFFF", color: '#012A52', fontWeight: '500' }}>
                  <BsSendFill /> Send Groupage
                </button>
              </Link> */}
              {/* {userRole === 'admin' ? null : (<>
                <div className="d-flex flex-column align-items-start justify-content-start"
                  onMouseEnter={() => { if (userRole === 'admin') return; setOpen(true) }}
                  onMouseLeave={() => { if (userRole === 'admin') return; setOpen(false) }}
                  onClick={() => { if (userRole === 'admin') return; setOpen(!open) }}
                >
                  <button
                    className="btn m-1"
                    style={{ backgroundColor: "#FFFFFF", color: '#012A52', fontWeight: '500' }}
                    onClick={() => { if (userRole === 'admin') navigate('/shipments'); else toggleMenu() }}
                  >
                    <BsSendFill /> <span style={{ fontSize: "16px" }}>Send {userRole === 'admin' ? 'Shipments' : 'Groupage'}</span>
                  </button>

                  {open && (
                    <div className="dropdown-menu dropdown-menu-navbar  d-flex flex-column align-items-center justify-content-center gap-1 text-start" style={nav_drop_down}>
                      <button onClick={() => { navigate('/send_groupage/item'); setOpen(false); }} className="btn groupage-btn"> <HiMiniRectangleStack className="fs-5 me-1" /> Send Items</button>
                      <button onClick={() => { navigate('/send_groupage/box'); setOpen(false); }} className="btn groupage-btn"><FaBoxOpen className="fs-5 me-1" /> Send Boxes</button>
                    </div>
                  )}
                </div>
              </>)} */}
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
              <FaTimes size={20} />
            </button>

            <div className="d-flex flex-column text-start align-items-start py-4 text-light">
              <Link to="/" className="py-2 text-light text-decoration-none" style={{ fontSize: "1rem" }} >Home</Link>
              <Link to="/how-it-works" className="py-2 text-light text-decoration-none" style={{ fontSize: "1rem" }} >How it Works</Link>
              {/* <Link to="/about_us" className="py-3 text-light text-decoration-none" onClick={() => { setIsOpen(false) }}>About Us</Link>    */}
              <Link to="/shipments" className="py-2 text-light text-decoration-none" onClick={() => { setIsOpen(false) }}>Shipments</Link>
              <Link to="/about_us" className="py-2 text-light text-decoration-none" onClick={() => { setIsOpen(false) }}>About</Link>
              <Link to="/contact_us" className="py-2 text-light text-decoration-none" onClick={() => { setIsOpen(false) }}>Contact Us</Link>

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
                  {/* <Link to="/send_groupage" className="py-2">
                    <button className="btn w-100" style={{ fontSize: "1rem", backgroundColor: "#FFFFFF", color: '#012A52' }}>
                      <BsSendFill /> Send Groupage
                    </button>
                  </Link> */}
                  {userRole === 'admin' ? null : (<>
                    <div className="d-flex flex-column align-items-start justify-content-start w-100 pe-2"
                      onMouseEnter={() => { if (userRole === 'admin') return; setOpen(true) }}
                      onMouseLeave={() => { if (userRole === 'admin') return; setOpen(false) }}
                      onClick={() => { if (userRole === 'admin') return; setOpen(!open) }}
                    >
                      <button
                        className="btn m-1 w-100"
                        style={{ backgroundColor: "#FFFFFF", color: '#012A52', fontWeight: '500' }}
                        onClick={() => { if (userRole === 'admin') navigate('/shipments'); else toggleMenu() }}
                      >
                        <BsSendFill /> <span style={{ fontSize: "16px" }}>Send {userRole === 'admin' ? 'Shipments' : 'Groupage'}</span>
                      </button>

                      {open && (
                        <div className="dropdown-menu dropdown-menu-navbar  d-flex flex-column align-items-center justify-content-center gap-1 text-start" style={nav_drop_down}>
                          <button onClick={() => { navigate('/send_groupage/item'); setOpen(false); }} className="btn groupage-btn"> <HiMiniRectangleStack className="fs-5 me-1" /> Send Items</button>
                          <button onClick={() => { navigate('/send_groupage/box'); setOpen(false); }} className="btn groupage-btn"><FaBoxOpen className="fs-5 me-1" /> Send Boxes</button>
                        </div>
                      )}
                    </div>
                  </>)}

                  {/* <FaBell className="fs-3 me-3 ms-3 my-2" style={{ color: ' #fff' }} onClick={() => { navigate('/notification') }} />
                  {(userRole === "admin" || userRole === "Sadmin" || userRole === 'user') && (
                    <Link to="/dashboard" >
                      <button className="btn btn-light w-100 mt-2" style={{ fontSize: "1rem", color: "#012A52" }}>
                        <MdDashboardCustomize />
                      </button>
                    </Link>
                  )} */}
                </>
              ) : (
                <>

                  {/* <Link to="/send_groupage" >
                    <button className="btn w-100 mt-2" style={{ fontSize: "1rem", backgroundColor: "#FFFFFF", color: '#012A52' }}>
                      <BsSendFill /> Send Groupage
                    </button>
                  </Link> */}
                  {userRole === 'admin' ? null : (<>
                    <div className="d-flex flex-column align-items-start justify-content-start w-100 pe-2"
                      onMouseEnter={() => { if (userRole === 'admin') return; setOpen(true) }}
                      onMouseLeave={() => { if (userRole === 'admin') return; setOpen(false) }}
                      onClick={() => { if (userRole === 'admin') return; setOpen(!open) }}
                    >
                      <button
                        className="btn m-1 w-100"
                        style={{ backgroundColor: "#FFFFFF", color: '#012A52', fontWeight: '500' }}
                        onClick={() => { if (userRole === 'admin') navigate('/shipments'); else toggleMenu() }}
                      >
                        <BsSendFill /> <span style={{ fontSize: "16px" }}>Send {userRole === 'admin' ? 'Shipments' : 'Groupage'}</span>
                      </button>

                      {open && (
                        <div className="dropdown-menu dropdown-menu-navbar  d-flex flex-column align-items-center justify-content-center gap-1 text-start" style={nav_drop_down}>
                          <button onClick={() => { navigate('/send_groupage/item'); setOpen(false); }} className="btn groupage-btn"> <HiMiniRectangleStack className="fs-5 me-1" /> Send Items</button>
                          <button onClick={() => { navigate('/send_groupage/box'); setOpen(false); }} className="btn groupage-btn"><FaBoxOpen className="fs-5 me-1" /> Send Boxes</button>
                        </div>
                      )}
                    </div>
                  </>)}
                  {/* <FaBell className="fs-3 me-3 ms-3" style={{ color: ' #fff' }} onClick={() => { navigate('/notification') }} /> */}
                  {/* <Link to="/login" >
                    <button className="btn btn-light w-100 mt-2" style={{ fontSize: "1rem", color: "#012A52" }}>
                      <FaUser /> Login
                    </button>
                  </Link> */}
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