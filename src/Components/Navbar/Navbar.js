import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { FaUser } from "react-icons/fa";
import { BsSendFill } from "react-icons/bs";
import { MdDashboardCustomize } from "react-icons/md";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { FaBell } from "react-icons/fa"
import Registration from "../Dashboard/Registration";
import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io"
import { useAlert } from "../alert/Alert_message";


const Navbar = () => {
  const userRole = localStorage.getItem('userRole');
  const { showAlert } = useAlert();
  const token = localStorage.getItem('token');
  // console.log(token.length,'this is length')
  const port = process.env.REACT_APP_SECRET;
  const navigate = useNavigate();
  const user_login_state = localStorage.getItem('user_logins_type');

  // const [mode, setMode] = useState(false);
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
            window.location.reload();
            navigate('/login');
          }
          if (response.data.status === true) {
            localStorage.setItem('userRole', response.data.message);
          }
        }).catch((err) => {
          console.log(err);
          // setMode(true);
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
      console.log('hello');
    } else {
      axios.get(`${port}/user/display_profile`, {
        headers: {
          Authorization: token,
        }
      }).then((response) => {
        setUserInfo(response.data.message);
      }).catch((err) => { });
    }
  }, [userRole]);

  // console.log('data-:', userInfo);


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
    backgroundColor: location.pathname === '/dashboard' ? ' #00232f' : ' #00232f',
    position: 'relative'
  };
  const logout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  }
  return (
    <div className="container-fluid">
      <nav className="d-flex justify-content-between align-items-center w-100 px-3 py-2"
        style={navStyle}>

        <div className="d-flex justify-content-start align-items-center ms-3">
          <Link to="/" style={{ textDecoration: "none" }} >
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                width: "150px", // Ensures proper scaling
                height: "80px",  // Adjusted for mobile & desktop
              }}
            >
              <img
                src="/Images/novibiz/fulllogo_transparent_nobuffer.png"
                alt="logo"
                className="img-fluid"
                style={{ maxHeight: "100%", objectFit: "contain" }} // Prevents cropping
              />
            </div>
          </Link>
        </div>




        <div className="d-lg-none">
          <button className="btn text-light" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
          </button>
        </div>

        <div className="d-none d-lg-flex justify-content-center align-items-center gap-4 flex-grow-1">
          <Link to="/" className="text-light text-decoration-none" style={{ fontSize: "1rem" }} >Home</Link>
          <Link to="/about_us" className="text-light text-decoration-none" style={{ fontSize: "1rem" }} >About Us</Link>
          <Link to="/companies_list" className="text-light text-decoration-none" style={{ fontSize: "1rem" }} >Companies</Link>
          <Link to="/offers" className="text-light text-decoration-none" style={{ fontSize: "1rem" }} >Offers</Link>
          {/* <Link to="/" className="text-light text-decoration-none" style={{ fontSize: "1.2rem" }}>Contact Us</Link> */}
        </div>

        <div className="d-none d-lg-flex justify-content-end align-items-center gap-2">
          {((!token || token.length === 0) || (userInfo && userInfo.role === 'Sadmin')) && (
            <Link to="/register_company" >
              <button className="btn text-light m-1" style={{ fontSize: "1rem", backgroundColor: "#de8316" }}>
                {(userInfo && userInfo.role === 'Sadmin') ? (
                  <span><IoIosAddCircleOutline className="fs-4" /> Add New Company</span>
                ) : (
                  'Register Your Company'
                )}
              </button>
            </Link>
          )}
          {token ? (
            <>
              <Link to="/send_groupage" >
                <button className="btn text-light m-1" style={{ backgroundColor: "#de8316" }}>
                  <BsSendFill /> <span style={{ fontSize: '1rem' }}>Send through groupage</span>
                </button>
              </Link>

              <FaBell className="fs-3 me-3 ms-3" style={{ color: ' #fff' }} onClick={() => {navigate('/notification')}} />
              {(userRole === "admin" || userRole === "Sadmin" || userRole === 'user') && (
                <Link to="/dashboard" >
                  <button className="btn btn-light m-1" style={{ fontSize: '1rem', color: "#de8316" }}>
                    <MdDashboardCustomize />
                  </button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/send_groupage" >
                <button className="btn text-light m-1" style={{ fontSize: "1rem", backgroundColor: "#de8316" }}>
                  <BsSendFill /> Send through groupage
                </button>
              </Link>
              <Link to="/login" >
                <button className="btn btn-light m-1" style={{ fontSize: "1rem", color: "#de8316" }}>
                  <FaUser /> Login
                </button>
              </Link>
            </>
          )}

        </div>

        {isOpen && (
          <div className="d-flex justify-content-end position-fixed top-0 end-0 ps-3 pe-3 rounded-4 shadow-lg"
            style={{ zIndex: 1050, paddingTop: "30px", backgroundColor: " rgba(0, 0, 0, 0.71)" }}>

            <button className="btn position-absolute text-light top-2 end-2" onClick={() => {setIsOpen(false)}}>
              <FaTimes size={30} />
            </button>

            <div className="d-flex flex-column text-center py-4 text-light">
              <Link to="/" className="text-light text-decoration-none" style={{ fontSize: "1rem" }} >Home</Link>
              <Link to="/about_us" className="py-3 text-light text-decoration-none" onClick={() => {setIsOpen(false) }}>About Us</Link>
              <Link to="/companies_list" className="py-3 text-light text-decoration-none" onClick={() => {setIsOpen(false)}}>Companies</Link>
              <Link to="/offers" className="py-3 text-light text-decoration-none" onClick={() => {setIsOpen(false)}}>Offers</Link>
              {/* <Link to="/" className="py-3 text-light text-decoration-none" onClick={() => setIsOpen(false)}>Contact Us</Link> */}
              {((!token || token.length === 0) || (userInfo && userInfo.role === 'Sadmin')) && (
                <Link to="/register_company" >
                  <button className="btn text-light m-1" style={{ fontSize: "1rem", backgroundColor: "#de8316" }}>
                    {(userInfo && userInfo.role === 'Sadmin') ? (
                      <span><IoIosAddCircleOutline /> Add New Company</span>
                    ) : (
                      'Register Your Company'
                    )}
                  </button>
                </Link>
              )}
              {token ? (
                <>
                  <Link to="/send_groupage" className="py-2">
                    <button className="btn text-light w-100" style={{ fontSize: "1rem", backgroundColor: "#de8316" }}>
                      <BsSendFill /> Send through groupage
                    </button>
                  </Link>
                  <FaBell className="fs-3 me-3 ms-3" style={{ color: ' #fff' }} onClick={() => {navigate('/notification')}} />
                  {(userRole === "admin" || userRole === "Sadmin" || userRole === 'user') && (
                    <Link to="/dashboard" >
                      <button className="btn btn-light w-100 mt-2" style={{ fontSize: "1rem", color: "#de8316" }}>
                        <MdDashboardCustomize />
                      </button>
                    </Link>
                  )}
                </>
              ) : (
                <>

                  <Link to="/send_groupage" >
                    <button className="btn text-light w-100 mt-2" style={{ fontSize: "1rem", backgroundColor: "#de8316" }}>
                      <BsSendFill /> Send through groupage
                    </button>
                  </Link>
                  <FaBell className="fs-3 me-3 ms-3" style={{ color: ' #fff' }} onClick={() => {navigate('/notification')}} />
                  <Link to="/login" >
                    <button className="btn btn-light w-100 mt-2" style={{ fontSize: "1rem", color: "#de8316" }}>
                      <FaUser /> Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* {isVisible && (
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
            <div className="position-relative bg-white p-4 rounded shadow-lg" style={{ width: '1300px', height: '40rem', overflowY: 'auto' }}>
              <button
                className="btn-close position-absolute top-0 end-0 m-2"
                onClick={handleClose}
              ></button>

              <div>
                <Registration />
              </div>

            </div>
          </div>
        )} */}
      </nav >
    </div>
  )
}

export default Navbar;