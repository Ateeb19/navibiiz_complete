// import logo from './logo.svg';
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
// import { Nav } from 'react-bootstrap';
import { IoMdHome } from "react-icons/io";
import { MdDashboardCustomize } from "react-icons/md";


import { Link, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './Components/User/LoginPage';
// import Regester_company from './Components/Companies/Regester_company';
// import newRegester_company from './Components/Companies/newregester';
// import Companies from './Components/Companies/Companies';
// import { TbUserPentagon } from "react-icons/tb";
import Home from './Components/New_update/home';
import Containers from './Components/New_update/Container';
import Groupage from './Components/New_update/Groupage';
import Cars from './Components/New_update/Cars';
import SendTransport from './Components/New_update/Send_Transport';
import CompleateDashbboard from './Components/Dashboard/Dashboard';
import Regesteration from './Components/Dashboard/Check ';
import axios from 'axios';
import CompaniesList from './Components/New_update/CompaniesList';
import send_groupage from './Components/send_groupage/Send_groupage';
import Offers from './Components/New_update/Offers';



const App = () => {
  const port = process.env.REACT_APP_SECRET ;

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isMobileView, setMobileView] = useState(false);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const userRole = localStorage.getItem('userRole');
  // console.log(userRole);
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 900);
      if (window.innerWidth >= 900) {
        setSidebarVisible(false); // Reset sidebar state for larger screens
      }
    };

    handleResize(); // Initialize on component mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      toggleButtonRef.current &&
      !toggleButtonRef.current.contains(event.target)
    ) {
      setSidebarVisible(false);
    }
  };

  const handleNavItemClick = () => {
    setSidebarVisible(false);
  };

  useEffect(() => {
    if (isSidebarVisible) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarVisible]);



  //company inof
  const displayCompany = () => {
    axios.get(`${port}/company/display_company`)
    .then((response) => {
        localStorage.setItem('companyInfo', JSON.stringify(response.data.message));
    }).catch((err) => {console.log('error', err)});
}
useEffect(() => {
  displayCompany();
},[])
  return (
    <div className="App container-fluid">
      <Router>
        <div className="d-flex flex-column" style={{ width: "100" }}>
          {/* <div className="d-flex justify-content-end">
            <Link to='/send_transport'><button className="btn btn-warning m-1" style={{ fontSize: "0.8rem" }}>Send/Transport</button></Link>
            <Link to='/login'><button className="btn btn-warning m-1" style={{ fontSize: "0.8rem" }}>SignUp</button></Link>
            <Link to='/'><button className="btn btn-warning m-1" style={{ fontSize: "0.8rem" }}><IoMdHome /></button></Link>
            { (userRole === 'admin' || userRole === 'Sadmin' )&& (
              <Link to='/dashboard'><button className="btn btn-warning m-1" style={{ fontSize: "0.8rem" }}><MdDashboardCustomize /></button></Link>
            )}
          </div> */}
          <Routes>
            <Route Component={CompleateDashbboard} path='/dashboard'></Route>
            <Route Component={Home} path='/'></Route>
            <Route Component={Offers} path='/offers'></Route>
            <Route Component={CompaniesList} path='/companies_list'></Route>
            <Route Component={send_groupage} path='/send_groupage'></Route>
            <Route Component={Containers} path='/container'></Route>
            <Route Component={Groupage} path='/groupage'></Route>
            <Route Component={Cars} path='/cars'></Route>
            <Route Component={SendTransport} path='/send_transport'></Route>
            <Route Component={LoginPage} path='/login'></Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
